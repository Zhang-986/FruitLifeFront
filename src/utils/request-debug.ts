// 请求调试工具
export const debugRequest = () => {
  console.log('=== 前端请求调试信息 ===')
  console.log('当前环境:', import.meta.env.MODE)
  console.log('开发环境:', import.meta.env.DEV)
  console.log('API Base URL:', import.meta.env.DEV ? '/api' : 'http://localhost:8080')
  console.log('代理配置: /api -> http://localhost:8080')
  console.log('=== 后端接口检查清单 ===')
  console.log('1. 后端是否在 http://localhost:8080 运行？')
  console.log('2. Controller 是否有 @RequestMapping("/user") 注解？')
  console.log('3. 登录方法是否映射到 @PostMapping("/login")？')
  console.log('4. 是否配置了 CORS 允许前端域名？')
  console.log('5. 请求参数是否匹配 GuestSessionsDTO？')
  console.log('========================')
}

// 测试后端连接
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/user/login', {
      method: 'OPTIONS'
    })
    console.log('后端连接测试:', response.status === 200 ? '成功' : '失败')
    return response.status === 200
  } catch (error) {
    console.error('后端连接测试失败:', error)
    return false
  }
}
