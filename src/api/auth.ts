import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 后端返回结果类型定义
interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 创建 axios 实例
const api = axios.create({
  // 开发环境使用代理，生产环境使用完整URL
  baseURL: import.meta.env.DEV ? '/api' : 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // 添加CORS相关配置
  withCredentials: false, // 如果后端需要携带cookie，设为true
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 确保GET请求不发送Content-Type
    if (config.method === 'get') {
      delete config.headers['Content-Type']
    }
    
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.params || config.data)
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('收到响应:', response.status, response.data)
    return response
  },
  (error: AxiosError) => {
    console.error('API Error:', error)
    
    // 特殊处理CORS错误
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      error.message = 'CORS跨域错误或网络连接失败，请检查后端是否配置了CORS'
    } else if (error.response?.status === 403) {
      error.message = 'CORS预检请求被拒绝，请检查后端CORS配置'
    } else if (error.response) {
      const message = (error.response.data as any)?.msg || `请求失败 (${error.response.status})`
      error.message = message
    } else if (error.request) {
      error.message = '网络连接失败，请检查网络或后端服务'
    } else {
      error.message = error.message || '请求配置错误'
    }
    
    return Promise.reject(error)
  }
)

// 发送验证码接口 - 使用GET请求，参数在URL中
export const sendVerificationCode = async (email: string): Promise<ApiResponse<string>> => {
  try {
    console.log('准备发送验证码请求:', email)
    const response = await api.get<ApiResponse<string>>('/user/getCode', {
      params: { email },
      headers: {
        // GET请求不需要Content-Type
        'Accept': 'application/json'
      }
    })
    
    const result = response.data
    console.log('验证码请求响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      // 业务失败
      const error = new Error(result.msg || '请求失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error) {
    console.error('验证码请求失败:', error)
    throw error
  }
}

// 注册接口（后续使用）
export const register = async (data: {
  email: string
  password: string
  verificationCode: string
}): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/user/register', data)
    
    const result = response.data
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      // 业务失败
      const error = new Error(result.msg || '请求失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error) {
    throw error
  }
}

// 登录接口（后续使用）
export const login = async (data: {
  email: string
  password: string
}): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/user/login', data)
    
    const result = response.data
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      // 业务失败
      const error = new Error(result.msg || '请求失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error) {
    throw error
  }
}

export default api
