// CORS错误处理工具
export const handleCorsError = (error: any): string => {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return `
      CORS跨域错误！请确保后端已配置CORS。
      
      后端需要添加以下配置：
      
      Java Spring Boot:
      @CrossOrigin(origins = "http://localhost:5173")
      或配置全局CORS
      
      当前请求从: http://localhost:5173
      发送到: http://localhost:8080
    `
  }
  
  if (error.response?.status === 403) {
    return `
      OPTIONS预检请求被拒绝！
      后端需要允许OPTIONS方法和相关headers。
    `
  }
  
  return error.message || '未知错误'
}

// 检查是否为CORS相关错误
export const isCorsError = (error: any): boolean => {
  return (
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error' ||
    (error.response?.status === 403 && error.config?.method === 'options')
  )
}
