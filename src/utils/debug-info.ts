import { requestInterceptor } from './request-interceptor'
import { ipResolver } from './ip-resolver'

/**
 * 调试信息收集器
 * 用于验证IP获取和请求拦截是否正常工作
 */
export class DebugInfo {
  
  /**
   * 显示当前IP获取状态
   */
  static async showIPStatus() {
    console.group('🔍 IP获取状态检查')
    
    try {
      // 获取当前IP
      const currentIP = await ipResolver.getClientIP()
      console.log('✅ 当前获取的IP:', currentIP)
      
      // 检查IP类型
      const isLAN = ipResolver.isLANIP(currentIP)
      console.log('🌐 IP类型:', isLAN ? '局域网IP' : '公网IP')
      
      // 获取详细网络信息
      const networkInfo = ipResolver.getNetworkInfo()
      console.table({
        '主机名': networkInfo.hostname,
        '端口': networkInfo.port || '默认',
        '协议': networkInfo.protocol,
        '用户代理': networkInfo.userAgent.substring(0, 50) + '...',
        '时间戳': networkInfo.timestamp
      })
      
      // 检查拦截器状态
      const interceptorIP = requestInterceptor.getCurrentIP()
      console.log('🎯 拦截器中的IP:', interceptorIP)
      
      return {
        success: true,
        ip: currentIP,
        isLAN,
        networkInfo
      }
      
    } catch (error) {
      console.error('❌ IP获取失败:', error)
      return {
        success: false,
        error: error
      }
    } finally {
      console.groupEnd()
    }
  }
  
  /**
   * 模拟请求，查看请求头
   */
  static async simulateRequest() {
    console.group('🚀 模拟请求测试')
    
    try {
      // 创建模拟的axios配置
      const mockConfig = {
        method: 'post',
        url: '/test',
        headers: {},
        data: { test: true }
      }
      
      // 使用拦截器处理
      const processedConfig = await requestInterceptor.interceptRequest(mockConfig as any)
      
      console.log('📋 处理后的请求头:')
      const ipHeaders = Object.entries(processedConfig.headers)
        .filter(([key]) => key.toLowerCase().includes('ip') || key.toLowerCase().includes('forwarded'))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
      
      console.table(ipHeaders)
      
      return processedConfig
      
    } catch (error) {
      console.error('❌ 模拟请求失败:', error)
    } finally {
      console.groupEnd()
    }
  }
  
  /**
   * 完整的诊断报告
   */
  static async generateReport() {
    console.group('📊 完整诊断报告')
    
    const ipStatus = await this.showIPStatus()
    const requestTest = await this.simulateRequest()
    
    const report = {
      timestamp: new Date().toISOString(),
      ipStatus,
      requestHeaders: requestTest?.headers || {},
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        onLine: navigator.onLine
      },
      locationInfo: {
        href: window.location.href,
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol
      }
    }
    
    console.log('📄 完整报告:', report)
    console.groupEnd()
    
    return report
  }
}

// 开发环境自动运行
if (import.meta.env.DEV) {
  // 页面加载完成后自动检查
  window.addEventListener('load', () => {
    setTimeout(() => {
      DebugInfo.showIPStatus()
    }, 2000)
  })
  
  // 暴露到全局供手动调用
  ;(window as any).debugIP = DebugInfo
}
