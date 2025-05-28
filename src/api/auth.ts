import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { requestInterceptor } from '@/utils/request-interceptor'

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
  timeout: 15000, // 增加超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // 添加CORS相关配置
  withCredentials: false, // 如果后端需要携带cookie，设为true
})

// 请求拦截器
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 使用IP拦截器处理客户端IP
    config = await requestInterceptor.interceptRequest(config)
    
    // 从localStorage获取token并添加到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('请求携带token:', token.substring(0, 20) + '...')
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
    
    // 详细的错误处理
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      console.error('后端服务器连接被拒绝，请检查：')
      console.error('1. 后端服务是否启动在 http://localhost:8080')
      console.error('2. 后端服务是否正常运行')
      console.error('3. 端口8080是否被占用')
      error.message = '无法连接到服务器，请检查后端服务是否启动'
    } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      error.message = 'CORS跨域错误或网络连接失败，请检查后端是否配置了CORS'
    } else if (error.response?.status === 403) {
      error.message = 'CORS预检请求被拒绝，请检查后端CORS配置'
    } else if (error.response?.status === 404) {
      error.message = '接口不存在，请检查API路径是否正确'
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

// 注册接口 - 简化为只发送email、code、password
export const register = async (data: {
  email: string
  password: string
  code: string
}): Promise<ApiResponse<any>> => {
  try {
    // 只发送三个必要字段
    const requestData = {
      email: data.email,
      password: data.password,
      code: data.code
    }
    
    console.log('准备发送注册请求:', requestData)
    const response = await api.post<ApiResponse<any>>('/user/register', requestData)
    
    const result = response.data
    console.log('注册请求响应:', result)
    
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
    console.error('注册请求失败:', error)
    throw error
  }
}

// 登录接口 - 按后端DTO要求发送email和password
export const login = async (data: {
  email: string
  password: string
}): Promise<ApiResponse<string>> => {
  try {
    // 构造请求数据
    const requestData = {
      email: data.email,
      password: data.password
    }
    
    console.log('准备发送登录请求到:', '/user/login')
    console.log('请求数据:', requestData)
    console.log('完整URL:', import.meta.env.DEV ? '/api/user/login' : 'http://localhost:8080/user/login')
    
    const response = await api.post<ApiResponse<string>>('/user/login', requestData)
    
    const result = response.data
    console.log('登录请求响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      console.log('登录成功，token:', result.data)
      return result
    } else {
      console.log('登录失败，错误信息:', result.msg)
      const error = new Error(result.msg || '登录失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error: any) {
    console.error('登录请求异常:', error)
    
    // 如果是网络错误，提供更具体的错误信息
    if (error.code === 'ERR_NETWORK') {
      console.error('网络连接失败，请检查：')
      console.error('1. 后端服务是否在 http://localhost:8080 运行')
      console.error('2. 接口路径是否为 /user/login')
      console.error('3. CORS配置是否正确')
    }
    
    throw error
  }
}

// 验证邮箱接口 - 用于忘记密码时验证邮箱是否存在
export const verifyEmail = async (email: string): Promise<ApiResponse<boolean>> => {
  try {
    console.log('准备验证邮箱:', email)
    console.log('请求URL:', '/user/verifyEmail')
    console.log('完整代理URL:', import.meta.env.DEV ? '/api/user/verifyEmail' : 'http://localhost:8080/user/verifyEmail')
    
    const response = await api.get<ApiResponse<boolean>>('/user/verifyEmail', {
      params: { email },
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const result = response.data
    console.log('邮箱验证响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      // 业务失败
      const error = new Error(result.msg || '邮箱验证失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error: any) {
    console.error('邮箱验证失败:', error)
    
    // 特殊处理连接错误
    if (error.code === 'ECONNREFUSED') {
      console.error('连接被拒绝，后端服务可能未启动')
    }
    
    throw error
  }
}

// 忘记密码发送验证码接口 - 使用统一的getCode接口
export const sendForgotPasswordCode = async (email: string): Promise<ApiResponse<string>> => {
  try {
    console.log('准备发送忘记密码验证码:', email)
    // 使用和注册相同的验证码接口
    const response = await api.get<ApiResponse<string>>('/user/getCode', {
      params: { email },
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const result = response.data
    console.log('忘记密码验证码响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      const error = new Error(result.msg || '验证码发送失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error) {
    console.error('忘记密码验证码发送失败:', error)
    throw error
  }
}

// 处理密码重置接口 - 用于忘记密码时重置密码
export const handlePassword = async (data: {
  email: string
  password: string
  code: string
}): Promise<ApiResponse<string>> => {
  try {
    const requestData = {
      email: data.email,
      password: data.password,
      code: data.code
    }
    
    console.log('准备发送密码重置请求:', requestData)
    const response = await api.post<ApiResponse<string>>('/user/handlePassword', requestData)
    
    const result = response.data
    console.log('密码重置响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      const error = new Error(result.msg || '密码重置失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error: any) {
    console.error('密码重置失败:', error)
    
    // 特殊处理连接错误
    if (error.code === 'ECONNREFUSED') {
      console.error('连接被拒绝，后端服务可能未启动')
    }
    
    throw error
  }
}

// 验证验证码接口 - 用于验证用户输入的验证码
export const verifyCode = async (data: {
  email: string
  code: string
}): Promise<ApiResponse<boolean>> => {
  try {
    console.log('准备验证验证码:', data)
    // 使用GET请求，参数通过query传递
    const response = await api.get<ApiResponse<boolean>>('/user/verifyEmail', {
      params: {
        email: data.email,
        code: data.code
      },
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const result = response.data
    console.log('验证码验证响应:', result)
    
    // 检查业务状态码
    if (result.code === 200) {
      return result
    } else {
      const error = new Error(result.msg || '验证码验证失败')
      error.name = 'BusinessError'
      ;(error as any).code = result.code
      throw error
    }
  } catch (error) {
    console.error('验证码验证失败:', error)
    throw error
  }
}

export default api
