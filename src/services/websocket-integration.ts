import { webSocketManager } from './websocket'
import { AuthManager } from '@/utils/auth-manager'
import { useWebSocketStore } from '@/stores/websocket'

/**
 * WebSocket集成服务
 * 负责在登录后自动初始化WebSocket连接
 */
export class WebSocketIntegration {
  private static instance: WebSocketIntegration
  private isInitialized = false

  static getInstance(): WebSocketIntegration {
    if (!WebSocketIntegration.instance) {
      WebSocketIntegration.instance = new WebSocketIntegration()
    }
    return WebSocketIntegration.instance
  }

  /**
   * 登录后初始化WebSocket
   */
  async initializeAfterLogin(): Promise<void> {
    console.log('🚀 WebSocket集成服务初始化...')
    
    if (this.isInitialized && webSocketManager.isConnected()) {
      console.log('🔄 WebSocket已连接，跳过重复初始化')
      return
    }

    try {
      // 检查登录状态
      if (!AuthManager.isLoggedIn()) {
        console.warn('❌ 用户未登录，无法初始化WebSocket')
        return
      }

      // 使用store来管理WebSocket
      const webSocketStore = useWebSocketStore()
      await webSocketStore.initialize()

      this.isInitialized = true
      console.log('✅ WebSocket集成服务初始化完成')

    } catch (error) {
      console.error('❌ WebSocket集成服务初始化失败:', error)
    }
  }

  /**
   * 设置WebSocket事件监听
   */
  private setupWebSocketListeners(): void {
    // 连接成功后的处理
    webSocketManager.on('connected', () => {
      console.log('🎉 WebSocket连接成功！')
      
      // 立即检查用户信息，不等待
      webSocketManager.checkUserInfo()
    })

    // 连接断开处理
    webSocketManager.on('disconnected', (reason) => {
      console.log('🔌 WebSocket连接断开:', reason)
    })

    // 错误处理
    webSocketManager.on('error', (error) => {
      console.error('❌ WebSocket错误:', error)
    })

    // 用户信息不完整处理
    webSocketManager.on('userInfoIncomplete', () => {
      this.handleUserInfoIncomplete()
    })

    // 用户信息完整处理
    webSocketManager.on('userInfoComplete', () => {
      this.handleUserInfoComplete()
    })

    // 设置消息处理器
    this.setupMessageHandlers()
  }

  /**
   * 设置消息处理器
   */
  private setupMessageHandlers(): void {
    // 处理用户信息不完整消息
    webSocketManager.onMessage('USER_INFO_INCOMPLETE', (message) => {
      console.log('📨 收到用户信息不完整消息:', message.data)
      this.handleUserInfoIncomplete()
    })

    // 处理用户信息完整消息
    webSocketManager.onMessage('USER_INFO_COMPLETE', (message) => {
      console.log('📨 收到用户信息完整消息:', message.data)
      this.handleUserInfoComplete()
    })
  }

  /**
   * 处理用户信息不完整
   */
  private handleUserInfoIncomplete(): void {
    console.log('⚠️ 用户信息不完整，需要完善个人信息')
    
    // 可以显示提示或者自动跳转到信息完善页面
    // 这里可以根据需要决定是否自动跳转
    // router.push('/user/profile')
  }

  /**
   * 处理用户信息完整
   */
  private handleUserInfoComplete(): void {
    console.log('✅ 用户信息完整，可以正常使用所有功能')
    
    // 用户信息完整，可以继续正常操作
  }

  /**
   * 手动检查用户信息
   */
  checkUserInfo(): void {
    webSocketManager.checkUserInfo()
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    webSocketManager.disconnect()
    this.isInitialized = false
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return webSocketManager.isConnected()
  }
}

// 导出单例实例
export const wsIntegration = WebSocketIntegration.getInstance()
