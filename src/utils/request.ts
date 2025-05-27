// 错误处理工具类
export class RequestError extends Error {
  code: number
  
  constructor(message: string, code: number = 500) {
    super(message)
    this.name = 'RequestError'
    this.code = code
  }
}

// 统一错误处理函数
export const handleApiError = (error: any): string => {
  console.error('API Error:', error)
  
  // 业务错误
  if (error.name === 'BusinessError') {
    return error.message
  }
  
  // 网络错误
  if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
    return '网络连接超时，请检查网络连接'
  }
  
  // HTTP状态码错误
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 400:
        return '请求参数错误'
      case 401:
        return '未授权，请重新登录'
      case 403:
        return '拒绝访问'
      case 404:
        return '请求的资源不存在'
      case 500:
        return '服务器内部错误'
      case 502:
        return '网关错误'
      case 503:
        return '服务不可用'
      case 504:
        return '网关超时'
      default:
        return `请求失败 (${status})`
    }
  }
  
  // 默认错误消息
  return error.message || '请求失败，请稍后重试'
}

// 成功提示工具函数
export const getSuccessMessage = (action: string): string => {
  const messages: Record<string, string> = {
    'sendCode': '验证码已发送到您的邮箱',
    'register': '注册成功',
    'login': '登录成功',
    'logout': '退出成功'
  }
  
  return messages[action] || '操作成功'
}
