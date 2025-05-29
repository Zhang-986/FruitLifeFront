import { useAuthStore } from '@/stores/auth'

/**
 * 认证管理器
 * 兼容性包装器，内部使用Pinia store
 */
export class AuthManager {
  private static readonly TOKEN_KEY = 'fruit_life_token'
  private static readonly USER_KEY = 'fruit_life_user'
  
  /**
   * 获取store实例
   */
  private static getStore() {
    return useAuthStore()
  }
  
  /**
   * 保存用户token和信息
   */
  static saveToken(token: string, userEmail?: string) {
    const store = this.getStore()
    store.saveToken(token, userEmail)
  }
  
  /**
   * 获取当前token
   */
  static getToken(): string | null {
    return localStorage.getItem('fruit_life_token')
  }
  
  /**
   * 获取用户信息
   */
  static getUserInfo(): { email: string; loginTime: string } | null {
    const store = this.getStore()
    return store.getUserInfo()
  }
  
  /**
   * 检查用户是否已登录
   */
  static isLoggedIn(): boolean {
    const store = this.getStore()
    return store.isLoggedIn
  }
  
  /**
   * 异步退出登录
   */
  static async logout(): Promise<void> {
    console.log('🚪 AuthManager开始退出登录流程')
    
    try {
      // 清除所有存储的认证信息
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      
      // 清除记住密码信息（可选）
      localStorage.removeItem('rememberPassword')
      localStorage.removeItem('savedEmail')
      localStorage.removeItem('savedPassword')
      
      console.log('✅ AuthManager退出登录完成，所有数据已清除')
      
      // 确保数据清除完成，添加微小延迟
      await new Promise(resolve => setTimeout(resolve, 10))
      
    } catch (error) {
      console.error('❌ AuthManager退出登录过程中发生错误:', error)
      throw error
    }
  }

  /**
   * 同步退出登录（向后兼容）
   */
  static logoutSync(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem('rememberPassword')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')
    console.log('🚪 同步退出登录完成')
  }
  
  /**
   * 获取用户显示名称
   */
  static getDisplayName(): string {
    const store = this.getStore()
    return store.displayName
  }
  
  /**
   * 检查token是否即将过期（可选功能）
   */
  static isTokenExpiringSoon(): boolean {
    const store = this.getStore()
    return store.isTokenExpiringSoon()
  }
}
