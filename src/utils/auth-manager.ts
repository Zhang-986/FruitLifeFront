import { useAuthStore } from '@/stores/auth'

/**
 * 认证管理器
 * 兼容性包装器，内部使用Pinia store
 */
export class AuthManager {
  private static readonly TOKEN_KEY = 'fruit_life_token'
  private static readonly USER_INFO_KEY = 'fruit_life_user'
  
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
    const store = this.getStore()
    return store.getToken()
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
   * 清除用户数据（退出登录）
   */
  static logout() {
    const store = this.getStore()
    store.logout()
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
  
  /**
   * 调试：显示当前存储状态
   */
  static debugStorage() {
    const store = this.getStore()
    store.debugStorage()
  }
}
