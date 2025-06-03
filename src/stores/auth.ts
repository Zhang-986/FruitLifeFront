import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo as fetchUserInfo, type UserInfoVo } from '@/api/profile'
import { checkAdminStatus } from '@/api/admin'

// Promise to ensure initialization logic runs once and can be awaited
let authInitializationPromise: Promise<void> | null = null;

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const userInfo = ref<{ email: string; loginTime: string } | null>(null)
  
  // 新增：用户详细信息缓存
  const userProfile = ref<UserInfoVo | null>(null)
  const userProfileLoaded = ref(false)
  // 新增：请求锁，防止并发请求
  const userProfileLoading = ref(false)
  
  // 新增：管理员状态
  const isAdminStatus = ref(false)
  const adminStatusChecked = ref(false)
  
  // 计算属性
  const isLoggedIn = computed(() => {
    return !!token.value && token.value.length > 0
  })
  
  const displayName = computed(() => {
    // 只从认证信息中获取显示名，个人资料的昵称在各组件中单独处理
    if (userInfo.value?.email) {
        const emailPrefix = userInfo.value.email.split('@')[0]
        // 避免返回过长的邮箱前缀
        return emailPrefix.length > 10 ? emailPrefix.substring(0, 10) + '...' : emailPrefix
    }
    return '用户'
  })

  // 管理员权限检查 - 统一的计算属性
  const isAdmin = computed(() => {
    return isAdminStatus.value
  })
  
  // 新增：用户完善状态计算属性
  const userCompletionStatus = computed(() => {
    if (!isLoggedIn.value || !userProfile.value) {
      return {
        color: 'grey',
        icon: 'mdi-account-circle-outline',
        text: '未登录'
      }
    }

    const profile = userProfile.value
    const hasBasicInfo = profile.nickname &&
      profile.age &&
      profile.gender &&
      profile.heightCm &&
      profile.weightKg

    if (profile.isCompleted && hasBasicInfo) {
      return {
        color: 'success',
        icon: 'mdi-check-circle',
        text: '资料完整'
      }
    } else if (profile.nickname) {
      return {
        color: 'warning',
        icon: 'mdi-account-edit',
        text: '部分完善'
      }
    } else {
      return {
        color: 'error',
        icon: 'mdi-alert-circle',
        text: '待完善'
      }
    }
  })
  
  // 初始化状态（从localStorage恢复）
  const initializeAuth = async () => {
    if (authInitializationPromise) {
      return authInitializationPromise;
    }

    authInitializationPromise = (async () => {
      console.log('🚀 Auth Store: Starting initialization...');
      const savedToken = localStorage.getItem('fruit_life_token')
      const savedUserInfo = localStorage.getItem('fruit_life_user')
      
      if (savedToken) {
        token.value = savedToken
        console.log('✅ Auth Store: Token restored from localStorage.', savedToken.substring(0, 20) + '...')
      }
      
      if (savedUserInfo) {
        try {
          userInfo.value = JSON.parse(savedUserInfo)
          console.log('✅ Auth Store: UserInfo restored from localStorage:', userInfo.value?.email)
        } catch (error) {
          console.warn('⚠️ Auth Store: UserInfo parsing failed from localStorage.', error)
          userInfo.value = null
        }
      }
      
      console.log('🔍 Auth Store: Initial login status from localStorage:', isLoggedIn.value);

      // Crucial part: check admin status if logged in
      if (isLoggedIn.value && userInfo.value?.email) {
        console.log('Auth Store: User is logged in. Checking admin status for', userInfo.value.email);
        await checkAdmin(userInfo.value.email); // This will set adminStatusChecked
        console.log(`Auth Store: Admin status checked. IsAdmin: ${isAdminStatus.value}, Checked: ${adminStatusChecked.value}`);
      } else {
        // If not logged in, or no email, admin status is definitively false and checked.
        isAdminStatus.value = false;
        adminStatusChecked.value = true; // Mark as checked
        console.log('Auth Store: User not logged in or no email. Admin status set to false and considered checked.');
      }
      console.log('🏁 Auth Store: Initialization complete.');
    })();
    
    return authInitializationPromise;
  }
  
  // 检查管理员权限
  const checkAdmin = async (email: string) => {
    if (adminStatusChecked.value) {
      console.log(`🛡️ Auth Store: Admin status already checked for ${email}. IsAdmin: ${isAdminStatus.value}. Returning cached status.`);
      return isAdminStatus.value
    }

    if (!email) {
        console.warn('🛡️ Auth Store: checkAdmin called with no email. Setting isAdmin to false.');
        isAdminStatus.value = false;
        adminStatusChecked.value = true;
        return false;
    }

    console.log(`🛡️ Auth Store: Checking admin status via API for ${email}...`);
    try {
      const response = await checkAdminStatus(email)
      const isAdminUser = response.code === 200 && response.data === "675314"
      isAdminStatus.value = isAdminUser
      console.log(`🛡️ Auth Store: Admin status API response for ${email}. IsAdmin: ${isAdminUser}`);
    } catch (error) {
      console.error(`❌ Auth Store: Error checking admin status for ${email}:`, error);
      isAdminStatus.value = false
    } finally {
      adminStatusChecked.value = true
      console.log(`🛡️ Auth Store: Admin status check complete for ${email}. IsAdmin: ${isAdminStatus.value}, Checked: ${adminStatusChecked.value}`);
    }
    return isAdminStatus.value
  }

  // 保存token和用户信息
  const saveToken = async (newToken: string, userEmail?: string) => {
    token.value = newToken
    localStorage.setItem('fruit_life_token', newToken)
    
    if (userEmail) {
      const newUserInfo = { 
        email: userEmail, 
        loginTime: new Date().toISOString() 
      }
      userInfo.value = newUserInfo
      localStorage.setItem('fruit_life_user', JSON.stringify(newUserInfo))
    }
    
    // Reset admin status check for the new/updated user
    adminStatusChecked.value = false;
    isAdminStatus.value = false; // Assume not admin until checked

    // 登录成功后预加载用户详细信息并检查管理员状态
    try {
      await loadUserProfile(true) // Force refresh profile
      
      const emailToCheck = userEmail || userInfo.value?.email;
      if (emailToCheck) {
        await checkAdmin(emailToCheck)
      } else {
        // If no email, admin status is false and checked
        isAdminStatus.value = false;
        adminStatusChecked.value = true;
      }
    } catch (error) {
      console.error('Auth Store: Error during post-saveToken operations (profile/admin check):', error);
      // Ensure adminStatusChecked is true even on error if no email was available to check
      if (! (userEmail || userInfo.value?.email) ) {
        isAdminStatus.value = false;
        adminStatusChecked.value = true;
      }
    }
  }

  // 新增：加载用户详细信息（带缓存和请求锁）
  const loadUserProfile = async (forceRefresh = false) => {
    // 如果正在加载中，等待当前请求完成
    if (userProfileLoading.value) {
      // 等待加载完成
      while (userProfileLoading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return userProfile.value
    }

    // 如果不强制刷新且已有缓存，直接返回缓存
    if (!forceRefresh && userProfileLoaded.value && userProfile.value) {
      return userProfile.value
    }

    if (!isLoggedIn.value) {
      return null
    }

    // 设置加载锁
    userProfileLoading.value = true

    try {
      const apiResponse = await fetchUserInfo()

      if (apiResponse && apiResponse.code === 200 && apiResponse.data) {
        userProfile.value = apiResponse.data
        userProfileLoaded.value = true
        return userProfile.value
      } else {
        userProfile.value = null
        userProfileLoaded.value = true
        return null
      }
    } catch (error) {
      userProfile.value = null
      userProfileLoaded.value = true
      return null
    } finally {
      // 释放加载锁
      userProfileLoading.value = false
    }
  }

  // 新增：更新用户信息缓存
  const updateUserProfile = (updatedProfile: UserInfoVo) => {
    userProfile.value = updatedProfile
  }

  // 新增：清除用户信息缓存
  const clearUserProfile = () => {
    userProfile.value = null
    userProfileLoaded.value = false
    userProfileLoading.value = false
  }

  // 新增：清除管理员状态
  const clearAdminStatus = () => {
    isAdminStatus.value = false
    adminStatusChecked.value = false
  }

  // 退出登录
  const logout = async () => {
    token.value = null
    userInfo.value = null
    
    // 新增：清除用户信息缓存
    clearUserProfile()
    
    // 清除管理员状态
    isAdminStatus.value = false;
    adminStatusChecked.value = true; // After logout, status is known (false) and checked
    
    // 同时清除localStorage
    localStorage.removeItem('fruit_life_token')
    localStorage.removeItem('fruit_life_user')
    localStorage.removeItem('rememberPassword')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')

    authInitializationPromise = null; // Reset initialization promise for potential re-login
    console.log('🔒 Auth Store: User logged out. Admin status reset and checked. Initialization promise reset.');
  }
  
  // 获取token
  const getToken = () => {
    return token.value
  }
  
  // 获取用户信息 - 重命名避免冲突
  const getAuthUserInfo = () => {
    return userInfo.value
  }
  
  // 检查token是否即将过期
  const isTokenExpiringSoon = () => {
    if (!userInfo.value?.loginTime) return false
    
    const loginTime = new Date(userInfo.value.loginTime)
    const now = new Date()
    const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
    
    return hoursSinceLogin > 20
  }

  return {
    // 状态
    token,
    userInfo,
    // 计算属性
    isLoggedIn,
    displayName,
    userProfile,
    userProfileLoaded,
    userCompletionStatus,
    isAdmin,
    // 方法
    initializeAuth,
    saveToken,
    logout,
    getToken,
    getUserInfo: getAuthUserInfo,
    isTokenExpiringSoon,
    loadUserProfile,
    updateUserProfile,
    clearUserProfile,
    // 新增：管理员相关
    adminStatusChecked, // Expose for debugging or specific checks if needed
    checkAdmin,
    clearAdminStatus
  }
})
