/**
 * IP解析工具类
 * 用于获取和处理客户端真实IP地址
 */
export class IPResolver {
  private static instance: IPResolver
  private clientIP: string | null = null
  private networkInfo: any = null

  private constructor() {}

  static getInstance(): IPResolver {
    if (!IPResolver.instance) {
      IPResolver.instance = new IPResolver()
    }
    return IPResolver.instance
  }

  /**
   * 获取客户端IP地址（多种方式尝试）
   */
  async getClientIP(): Promise<string> {
    if (this.clientIP) {
      return this.clientIP
    }

    try {
      // 方法1: 通过WebRTC获取本地IP
      const webrtcIP = await this.getWebRTCIP()
      if (webrtcIP && this.isValidIP(webrtcIP)) {
        this.clientIP = webrtcIP
        console.log('🌐 通过WebRTC获取到客户端IP:', webrtcIP)
        return webrtcIP
      }

      // 方法2: 通过公共API获取外网IP
      const publicIP = await this.getPublicIP()
      if (publicIP && this.isValidIP(publicIP)) {
        this.clientIP = publicIP
        console.log('🌐 通过公共API获取到客户端IP:', publicIP)
        return publicIP
      }

      // 方法3: 从当前连接信息推断
      const inferredIP = this.getInferredIP()
      this.clientIP = inferredIP
      console.log('🌐 推断客户端IP:', inferredIP)
      return inferredIP

    } catch (error) {
      console.warn('⚠️ 获取客户端IP失败:', error)
      // 降级方案
      const fallbackIP = this.getFallbackIP()
      this.clientIP = fallbackIP
      return fallbackIP
    }
  }

  /**
   * 通过WebRTC获取本地IP
   */
  private getWebRTCIP(): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const rtc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        })

        rtc.createDataChannel('')
        rtc.createOffer().then(offer => rtc.setLocalDescription(offer))

        rtc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate
            const ipMatch = candidate.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/)
            if (ipMatch) {
              const ip = ipMatch[1]
              if (!ip.startsWith('127.') && !ip.startsWith('169.254.')) {
                rtc.close()
                resolve(ip)
                return
              }
            }
          }
        }

        // 超时处理
        setTimeout(() => {
          rtc.close()
          resolve(null)
        }, 3000)

      } catch (error) {
        console.warn('WebRTC IP获取失败:', error)
        resolve(null)
      }
    })
  }

  /**
   * 通过公共API获取外网IP
   */
  private async getPublicIP(): Promise<string | null> {
    const apis = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://ifconfig.me/ip'
    ]

    for (const api of apis) {
      try {
        const response = await fetch(api, { 
          method: 'GET',
          timeout: 3000 
        } as any)
        
        if (response.ok) {
          const text = await response.text()
          let ip: string
          
          try {
            const json = JSON.parse(text)
            ip = json.ip || json.query
          } catch {
            ip = text.trim()
          }

          if (this.isValidIP(ip)) {
            return ip
          }
        }
      } catch (error) {
        console.warn(`API ${api} 请求失败:`, error)
        continue
      }
    }
    
    return null
  }

  /**
   * 从当前连接信息推断IP
   */
  private getInferredIP(): string {
    const hostname = window.location.hostname
    
    // 如果是IP地址直接访问
    if (this.isValidIP(hostname)) {
      return hostname
    }
    
    // 如果是localhost，尝试推断局域网IP
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return this.guessLANIP()
    }
    
    // 其他情况返回主机名
    return hostname
  }

  /**
   * 猜测局域网IP段
   */
  private guessLANIP(): string {
    // 常见的局域网IP段
    const commonLANRanges = [
      '192.168.1.100',
      '192.168.0.100', 
      '10.0.0.100',
      '172.16.0.100'
    ]
    
    // 返回最可能的IP（可以根据实际情况调整）
    return commonLANRanges[0]
  }

  /**
   * 降级方案
   */
  private getFallbackIP(): string {
    const hostname = window.location.hostname
    return hostname === 'localhost' ? '127.0.0.1' : hostname
  }

  /**
   * 验证IP地址格式
   */
  private isValidIP(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRegex.test(ip)
  }

  /**
   * 获取网络信息
   */
  getNetworkInfo() {
    if (!this.networkInfo) {
      this.networkInfo = {
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timestamp: new Date().toISOString()
      }
    }
    return this.networkInfo
  }

  /**
   * 判断是否为局域网IP
   */
  isLANIP(ip: string): boolean {
    return ip.startsWith('192.168.') || 
           ip.startsWith('10.') || 
           ip.startsWith('172.16.') ||
           ip.startsWith('172.17.') ||
           ip.startsWith('172.18.') ||
           ip.startsWith('172.19.') ||
           ip.startsWith('172.20.') ||
           ip.startsWith('172.21.') ||
           ip.startsWith('172.22.') ||
           ip.startsWith('172.23.') ||
           ip.startsWith('172.24.') ||
           ip.startsWith('172.25.') ||
           ip.startsWith('172.26.') ||
           ip.startsWith('172.27.') ||
           ip.startsWith('172.28.') ||
           ip.startsWith('172.29.') ||
           ip.startsWith('172.30.') ||
           ip.startsWith('172.31.')
  }

  /**
   * 清除缓存的IP
   */
  clearCache() {
    this.clientIP = null
    this.networkInfo = null
  }

  /**
   * 获取详细的客户端信息
   */
  async getDetailedClientInfo() {
    const ip = await this.getClientIP()
    const networkInfo = this.getNetworkInfo()
    
    return {
      ip,
      isLAN: this.isLANIP(ip),
      ...networkInfo
    }
  }
}

// 导出单例实例
export const ipResolver = IPResolver.getInstance()
