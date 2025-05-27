// Token管理工具
export class AuthManager {
  private static readonly TOKEN_KEY = 'token'
  private static readonly USER_EMAIL_KEY = 'userEmail'
  private static readonly LOGIN_TIME_KEY = 'loginTime'

  // 保存token
  static saveToken(token: string, email: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USER_EMAIL_KEY, email)
    localStorage.setItem(this.LOGIN_TIME_KEY, new Date().getTime().toString())
    console.log('Token已保存:', token)
    console.log('用户邮箱已保存:', email)
  }

  // 获取token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // 获取用户邮箱
  static getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY)
  }

  // 检查是否已登录
  static isLoggedIn(): boolean {
    return !!this.getToken()
  }

  // 清除token（退出登录）
  static clearToken() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_EMAIL_KEY)
    localStorage.removeItem(this.LOGIN_TIME_KEY)
    console.log('Token已清除')
  }
}
