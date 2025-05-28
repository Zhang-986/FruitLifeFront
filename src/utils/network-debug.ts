import { requestInterceptor } from './request-interceptor'
import { ipResolver } from './ip-resolver'

/**
 * 网络调试工具
 * 用于开发环境下调试网络连接和IP获取
 */
export class NetworkDebugger {
  
  /**
   * 显示完整的网络诊断信息
   */
  static async showNetworkDiagnosis() {
    console.group('🔍 网络诊断信息')
    
    try {
      // 获取客户端信息
      const clientInfo = await requestInterceptor.getClientInfo()
      console.table({
        '客户端IP': clientInfo.ip,
        '连接类型': clientInfo.isLAN ? '局域网' : '外网',
        '主机名': clientInfo.hostname,
        '端口': clientInfo.port || '默认',
        '协议': clientInfo.protocol,
        '平台': clientInfo.platform,
        '语言': clientInfo.language
      })
      
      // 显示访问地址
      const accessUrls = this.getAccessUrls(clientInfo)
      console.log('📱 访问地址:')
      accessUrls.forEach(url => console.log(`  ${url}`))
      
      // 显示后端连接信息
      console.log('🔗 后端连接信息:')
      console.log(`  代理目标: http://localhost:8080`)
      console.log(`  API路径: /api/*`)
      
    } catch (error) {
      console.error('❌ 网络诊断失败:', error)
    }
    
    console.groupEnd()
  }
  
  /**
   * 获取所有可能的访问地址
   */
  private static getAccessUrls(clientInfo: any): string[] {
    const port = window.location.port || '5173'
    const protocol = window.location.protocol
    
    const urls = [
      `${protocol}//localhost:${port}`,
      `${protocol}//127.0.0.1:${port}`
    ]
    
    if (clientInfo.ip && clientInfo.ip !== 'localhost' && clientInfo.ip !== '127.0.0.1') {
      urls.push(`${protocol}//${clientInfo.ip}:${port}`)
    }
    
    return urls
  }
  
  /**
   * 测试IP获取功能
   */
  static async testIPResolution() {
    console.group('🧪 IP解析测试')
    
    try {
      // 清除缓存重新获取
      ipResolver.clearCache()
      const ip = await ipResolver.getClientIP()
      
      console.log('✅ IP获取成功:', ip)
      console.log('📊 IP类型:', ipResolver.isLANIP(ip) ? '局域网IP' : '公网IP')
      
    } catch (error) {
      console.error('❌ IP获取失败:', error)
    }
    
    console.groupEnd()
  }
  
  /**
   * 显示请求头信息预览
   */
  static async showRequestHeaders() {
    console.group('📋 请求头预览')
    
    try {
      await requestInterceptor.initialize()
      const clientInfo = await requestInterceptor.getClientInfo()
      
      const headers = {
        'X-Client-IP': clientInfo.ip,
        'X-Forwarded-For': clientInfo.ip,
        'X-Real-IP': clientInfo.ip,
        'X-Original-IP': clientInfo.ip,
        'X-Client-Host': clientInfo.hostname,
        'X-Client-Port': clientInfo.port || '80',
        'X-Client-Protocol': clientInfo.protocol,
        'X-Frontend-Request': 'true',
        'X-Frontend-Version': '1.0.0'
      }
      
      console.table(headers)
      
    } catch (error) {
      console.error('❌ 请求头生成失败:', error)
    }
    
    console.groupEnd()
  }
}

// 开发环境自动运行诊断
if (import.meta.env.DEV) {
  // 延迟执行，确保应用已初始化
  setTimeout(() => {
    NetworkDebugger.showNetworkDiagnosis()
  }, 1000)
}

// 暴露到全局供调试使用
if (import.meta.env.DEV) {
  (window as any).networkDebug = NetworkDebugger
}
