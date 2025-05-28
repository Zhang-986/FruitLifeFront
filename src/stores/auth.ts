import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const userInfo = ref<{ email: string; loginTime: string } | null>(null)
  
  // 计算属性
  const isLoggedIn = computed(() => {
    return !!token.value && token.value.length > 0
  })
  
  const displayName = computed(() => {
    if (userInfo.value?.email) {
      return userInfo.value.email.split('@')[0]
    }
    return '用户'
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
  
  // 保存token和用户信息
  const saveToken = (newToken: string, userEmail?: string) => {
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
    
    console.log('✅ token已保存并更新状态:', newToken.substring(0, 20) + '...')
    console.log('🔍 保存后登录状态:', isLoggedIn.value)
  }
  
  // 退出登录
  const logout = async () => {
    console.log('🚪 AuthStore开始退出登录')
    
    // 立即清除store状态
    token.value = null
    userInfo.value = null
    
    // 同时清除localStorage
    localStorage.removeItem('fruit_life_token')
    localStorage.removeItem('fruit_life_user')
    localStorage.removeItem('rememberPassword')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')
    
    console.log('✅ AuthStore退出登录完成，状态已清除')
    console.log('🔍 退出后登录状态:', isLoggedIn.value)
  }
  
  // 获取token
  const getToken = () => {
    return token.value
  }
  
  // 获取用户信息
  const getUserInfo = () => {
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
  
  // 调试存储状态
  const debugStorage = () => {
    console.group('🔍 认证状态检查')
    console.log('Store Token:', token.value)
    console.log('Store UserInfo:', userInfo.value)
    console.log('Store 登录状态:', isLoggedIn.value)
    console.log('LocalStorage Token:', localStorage.getItem('fruit_life_token'))
    console.log('LocalStorage UserInfo:', localStorage.getItem('fruit_life_user'))
    console.groupEnd()
  }
  
  return {
    // 状态
    token,
    userInfo,
    // 计算属性
    isLoggedIn,
    displayName,
    // 方法
    initializeAuth,
    saveToken,
    logout, // 现在是异步方法
    getToken,
    getUserInfo,
    isTokenExpiringSoon,
    debugStorage
  }
})
