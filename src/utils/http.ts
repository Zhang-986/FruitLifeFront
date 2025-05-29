import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { AuthManager } from './auth-manager'

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: '/api', // 使用代理时去掉完整URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // 添加CORS相关配置
  withCredentials: false, // 如果后端不需要cookies，设为false避免预检请求
})

// 请求拦截器 - 自动添加token
instance.interceptors.request.use(
  (config) => {
    // 修复：安全处理baseURL和url拼接
    const fullUrl = (config.baseURL || '') + (config.url || '')
    console.log('🚀 发送HTTP请求:', config.method?.toUpperCase(), fullUrl)
    
    // 处理请求数据，确保布尔值等类型正确传递
    if (config.data && typeof config.data === 'object') {
      // 深度处理数据，确保布尔值不会被转换为null
      config.data = JSON.parse(JSON.stringify(config.data))
      console.log('📤 请求数据:', config.data)
    }
    
    // 自动添加认证token - 使用与auth.ts相同的header名称
    const token = AuthManager.getToken()
    if (token) {
      // 使用'token'头部，与您的auth.ts保持一致
      config.headers['token'] = token
      console.log('🔐 已添加token header:', token.substring(0, 20) + '...')
    } else {
      console.warn('⚠️ 未找到token，请求可能需要认证')
    }
    
    return config
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理CORS错误和token过期
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ HTTP响应成功:', response.status, response.config.url)
    console.log('📦 响应数据:', response.data)
    return response.data // 直接返回响应数据
  },
  (error) => {
    console.error('❌ HTTP响应错误:', error)
    console.error('📦 错误详情:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url
      }
    })
    
    // 处理CORS错误
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🚫 CORS跨域错误或网络连接失败!')
      console.error('请检查：')
      console.error('1. 后端服务是否在 http://localhost:8080 启动')
      console.error('2. 后端是否配置了CORS允许前端域名 http://localhost:5173')
      console.error('3. 防火墙是否阻止了8080端口')
      
      const corsError = new Error('CORS跨域错误或网络连接失败，请检查后端是否配置了CORS')
      corsError.name = 'BusinessError'
      return Promise.reject(corsError)
    }
    
    // 处理401未授权错误
    if (error.response?.status === 401) {
      console.warn('🚪 Token过期或无效，清除认证信息')
      
      // 清除认证信息
      AuthManager.logout()
      
      // 跳转到登录页
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// 导出HTTP方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, config)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.patch(url, data, config)
  }
}

export default http
