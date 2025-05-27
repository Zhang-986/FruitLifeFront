// 后端连接检测工具
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('检测后端连接状态...')
    
    // 尝试连接后端健康检查接口
    const response = await fetch('http://localhost:8080/health', {
      method: 'GET',
      mode: 'cors'
    })
    
    if (response.ok) {
      console.log('✅ 后端连接正常')
      return true
    } else {
      console.warn('⚠️ 后端响应异常:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ 后端连接失败:', error)
    console.error('请检查：')
    console.error('1. 后端服务是否在 http://localhost:8080 启动')
    console.error('2. 后端是否配置了CORS允许前端域名')
    console.error('3. 防火墙是否阻止了8080端口')
    return false
  }
}

// 显示连接状态
export const showConnectionStatus = async () => {
  const isConnected = await checkBackendConnection()
  
  if (!isConnected) {
    console.log('🔧 后端连接问题排查：')
    console.log('1. 确认后端Spring Boot应用已启动')
    console.log('2. 检查application.yml中的端口配置')
    console.log('3. 确认CORS配置允许前端域名访问')
    console.log('4. 检查网络和防火墙设置')
  }
  
  return isConnected
}
