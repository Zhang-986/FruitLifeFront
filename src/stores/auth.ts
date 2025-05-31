import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo as fetchUserInfo, type UserInfoVo } from '@/api/profile'
import { checkAdminStatus } from '@/api/admin'

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
  const isAdmin = ref(false)
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
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('fruit_life_token')
    const savedUserInfo = localStorage.getItem('fruit_life_user')
    
    if (savedToken) {
      token.value = savedToken
      console.log('✅ 恢复token:', savedToken.substring(0, 20) + '...')
    }
    
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
        console.log('✅ 恢复用户信息:', userInfo.value?.email)
      } catch (error) {
        console.warn('⚠️ 用户信息解析失败', error)
        userInfo.value = null
      }
    }
    
    console.log('🔍 初始化后登录状态:', isLoggedIn.value)
  }
  
  // 检查管理员权限
  const checkAdmin = async (email: string) => {
    if (adminStatusChecked.value) {
      return isAdmin.value
    }

    try {
      const response = await checkAdminStatus(email)
      const isAdminUser = response.code === 200 && response.data === "675314"
      isAdmin.value = isAdminUser
      adminStatusChecked.value = true
      return isAdminUser
    } catch (error) {
      isAdmin.value = false
      adminStatusChecked.value = true
      return false
    }
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
    
    // 登录成功后预加载用户详细信息
    try {
      await loadUserProfile(true)
      
      if (userEmail) {
        await checkAdmin(userEmail)
      } else if (userInfo.value?.email) {
        await checkAdmin(userInfo.value.email)
      }
    } catch (error) {
      // 静默处理错误
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
    isAdmin.value = false
    adminStatusChecked.value = false
  }

  // 退出登录
  const logout = async () => {
    token.value = null
    userInfo.value = null
    
    // 新增：清除用户信息缓存
    clearUserProfile()
    
    // 新增：清除管理员状态
    clearAdminStatus()
    
    // 同时清除localStorage
    localStorage.removeItem('fruit_life_token')
    localStorage.removeItem('fruit_life_user')
    localStorage.removeItem('rememberPassword')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')
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
    isAdmin,
    adminStatusChecked,
    checkAdmin,
    clearAdminStatus
  }
})
