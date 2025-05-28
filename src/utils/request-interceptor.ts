import type { InternalAxiosRequestConfig } from 'axios'
import { ipResolver } from './ip-resolver'

/**
 * 请求拦截器工具
 * 用于在每次API请求中自动添加客户端IP信息
 */
export class RequestInterceptor {
  private static instance: RequestInterceptor
  private clientIP: string | null = null
  private isInitialized: boolean = false

  private constructor() {}

  static getInstance(): RequestInterceptor {
    if (!RequestInterceptor.instance) {
      RequestInterceptor.instance = new RequestInterceptor()
    }
    return RequestInterceptor.instance
  }

  /**
   * 初始化拦截器（获取客户端IP）
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    try {
      console.log('🚀 正在初始化请求拦截器...')
      this.clientIP = await ipResolver.getClientIP()
      console.log('✅ 请求拦截器初始化完成，客户端IP:', this.clientIP)
      this.isInitialized = true
    } catch (error) {
      console.error('❌ 请求拦截器初始化失败:', error)
      this.clientIP = '127.0.0.1' // 降级方案
      this.isInitialized = true
    }
  }

  /**
   * Axios请求拦截器函数
   */
  async interceptRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    // 确保已初始化
    if (!this.isInitialized) {
      await this.initialize()
    }

    // 添加客户端IP到请求头
    if (this.clientIP) {
      config.headers = config.headers || {}
      
      // 设置多个IP相关的头部，确保后端能获取到
      config.headers['X-Client-IP'] = this.clientIP
      config.headers['X-Forwarded-For'] = this.clientIP
      config.headers['X-Real-IP'] = this.clientIP
      config.headers['X-Original-IP'] = this.clientIP
      
      // 添加其他有用的客户端信息
      const networkInfo = ipResolver.getNetworkInfo()
      config.headers['X-Client-Host'] = networkInfo.hostname
      config.headers['X-Client-Port'] = networkInfo.port || '80'
      config.headers['X-Client-Protocol'] = networkInfo.protocol
      config.headers['X-Client-User-Agent'] = networkInfo.userAgent
      config.headers['X-Request-Time'] = new Date().toISOString()
      
      // 标识这是一个前端请求
      config.headers['X-Frontend-Request'] = 'true'
      config.headers['X-Frontend-Version'] = '1.0.0'
    }

    // 日志记录（开发环境）
    if (import.meta.env.DEV) {
      console.log('📤 发送请求:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        clientIP: this.clientIP,
        headers: {
          'X-Client-IP': config.headers['X-Client-IP'],
          'X-Forwarded-For': config.headers['X-Forwarded-For'],
          'X-Real-IP': config.headers['X-Real-IP']
        }
      })
    }

    return config
  }

  /**
   * 获取当前客户端IP
   */
  getCurrentIP(): string | null {
    return this.clientIP
  }

  /**
   * 手动刷新客户端IP
   */
  async refreshClientIP(): Promise<string> {
    ipResolver.clearCache()
    this.clientIP = await ipResolver.getClientIP()
    console.log('🔄 客户端IP已刷新:', this.clientIP)
    return this.clientIP
  }

  /**
   * 获取详细的客户端信息
   */
  async getClientInfo() {
    if (!this.isInitialized) {
      await this.initialize()
    }
    return await ipResolver.getDetailedClientInfo()
  }
}

// 导出单例实例
export const requestInterceptor = RequestInterceptor.getInstance()
