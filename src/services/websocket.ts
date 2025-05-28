import type {
  ClientMessage,
  ServerMessage,
  WebSocketConfig,
  WebSocketEvents,
  MessageHandler
} from '@/types/websocket'
import { WebSocketStatus } from '@/types/websocket'
import { AuthManager } from '@/utils/auth-manager'

/**
 * WebSocket连接管理器
 * 提供WebSocket连接、重连、消息发送等功能
 */
export class WebSocketManager {
  private ws: WebSocket | null = null
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED
  private reconnectAttempts = 0
  private heartbeatTimer: number | null = null
  private reconnectTimer: number | null = null
  private messageQueue: ClientMessage[] = []
  private messageHandlers = new Map<string, MessageHandler[]>()
  private eventHandlers: Partial<WebSocketEvents> = {}

  private config: WebSocketConfig = {
    // 匹配后端的端点 /ws/user
    url: import.meta.env.DEV ? 'ws://localhost:8080/ws/user' : 'wss://your-domain.com/ws/user',
    reconnectInterval: 2000, // 减少重连间隔
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    connectionTimeout: 5000 // 减少连接超时时间
  }

  constructor(config?: Partial<WebSocketConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * 建立WebSocket连接
   */
  async connect(): Promise<void> {
    if (this.status === WebSocketStatus.CONNECTED || this.status === WebSocketStatus.CONNECTING) {
      console.log('WebSocket已连接或正在连接中')
      return
    }

    // 检查是否有有效的JWT token
    if (!AuthManager.isLoggedIn()) {
      console.warn('❌ 用户未登录，无法建立WebSocket连接')
      throw new Error('用户未登录')
    }

    try {
      this.status = WebSocketStatus.CONNECTING
      this.eventHandlers.reconnecting?.(this.reconnectAttempts)

      console.log('🔌 正在建立WebSocket连接...', this.config.url)

      // 创建WebSocket连接，在URL中携带JWT token
      const token = AuthManager.getToken()
      const wsUrl = `${this.config.url}?token=${encodeURIComponent(token!)}`
      
      this.ws = new WebSocket(wsUrl)

      // 设置连接超时
      const connectionTimeout = setTimeout(() => {
        if (this.status === WebSocketStatus.CONNECTING) {
          console.error('❌ WebSocket连接超时')
          this.ws?.close()
          this.handleConnectionError(new Error('连接超时'))
        }
      }, this.config.connectionTimeout)

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout)
        this.handleConnectionOpen()
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(event)
      }

      this.ws.onclose = (event) => {
        this.handleConnectionClose(event)
      }

      this.ws.onerror = (event) => {
        clearTimeout(connectionTimeout)
        this.handleConnectionError(new Error('WebSocket连接错误'))
      }

    } catch (error) {
      console.error('❌ WebSocket连接失败:', error)
      this.handleConnectionError(error as Error)
      throw error
    }
  }

  /**
   * 断开WebSocket连接
   */
  disconnect(): void {
    console.log('🔌 断开WebSocket连接')
    
    this.stopHeartbeat()
    this.stopReconnect()
    
    if (this.ws) {
      this.ws.close(1000, '主动断开')
      this.ws = null
    }
    
    this.status = WebSocketStatus.DISCONNECTED
    this.reconnectAttempts = 0
    this.messageQueue = []
  }

  /**
   * 发送消息
   */
  send(message: ClientMessage): void {
    // 添加时间戳和请求ID
    const enrichedMessage: ClientMessage = {
      ...message,
      timestamp: Date.now(),
      requestId: this.generateRequestId()
    }

    if (this.status === WebSocketStatus.CONNECTED && this.ws) {
      try {
        this.ws.send(JSON.stringify(enrichedMessage))
        console.log('📤 发送WebSocket消息:', enrichedMessage.type, enrichedMessage)
      } catch (error) {
        console.error('❌ 发送消息失败:', error)
        // 连接可能已断开，将消息加入队列
        this.messageQueue.push(enrichedMessage)
      }
    } else {
      // 连接未建立，将消息加入队列
      this.messageQueue.push(enrichedMessage)
      console.log('📝 消息已加入队列，等待连接建立')
      
      // 如果未连接，尝试重新连接
      if (this.status === WebSocketStatus.DISCONNECTED) {
        this.connect()
      }
    }
  }

  /**
   * 注册消息处理器
   */
  onMessage<T extends ServerMessage>(type: T['type'], handler: MessageHandler<T>): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler as MessageHandler)
  }

  /**
   * 注册事件处理器
   */
  on<K extends keyof WebSocketEvents>(event: K, handler: WebSocketEvents[K]): void {
    this.eventHandlers[event] = handler
  }

  /**
   * 获取连接状态
   */
  getStatus(): WebSocketStatus {
    return this.status
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.status === WebSocketStatus.CONNECTED
  }

  // 私有方法

  private handleConnectionOpen(): void {
    console.log('✅ WebSocket连接已建立')
    this.status = WebSocketStatus.CONNECTED
    this.reconnectAttempts = 0
    
    // 连接成功后只检查一次用户信息
    setTimeout(() => {
      this.checkUserInfo()
    }, 500)
    
    // 启动心跳（增加心跳间隔，减少请求）
    this.startHeartbeat()
    
    // 发送队列中的消息
    this.sendQueuedMessages()
    
    // 触发连接事件
    this.eventHandlers.connected?.()
  }

  private handleConnectionClose(event: CloseEvent): void {
    console.log('🔌 WebSocket连接已关闭:', event.code, event.reason)
    this.status = WebSocketStatus.DISCONNECTED
    this.stopHeartbeat()
    
    // 触发断开事件
    this.eventHandlers.disconnected?.(event.reason)
    
    // 如果不是主动断开，尝试重连
    if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect()
    }
  }

  private handleConnectionError(error: Error): void {
    console.error('❌ WebSocket连接错误:', error)
    this.status = WebSocketStatus.ERROR
    this.eventHandlers.error?.(error)
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const messageData = event.data
      console.log('📨 收到WebSocket消息:', messageData)
      
      // 处理后端的简单消息格式
      if (messageData === '8888') {
        // 用户信息不完整
        this.handleUserInfoIncomplete()
      } else if (messageData === '666') {
        // 用户信息完整
        this.handleUserInfoComplete()
      } else {
        // 处理其他可能的JSON格式消息
        try {
          const message: ServerMessage = JSON.parse(messageData)
          console.log('📨 收到WebSocket结构化消息:', message.type, message)
          
          // 处理特殊消息
          if (message.type === 'PONG') {
            return
          }
          
          // 触发通用消息事件
          this.eventHandlers.message?.(message)
          
          // 触发特定类型的消息处理器
          const handlers = this.messageHandlers.get(message.type)
          if (handlers) {
            handlers.forEach(handler => {
              try {
                handler(message)
              } catch (error) {
                console.error(`❌ 消息处理器错误 (${message.type}):`, error)
              }
            })
          }
        } catch (error) {
          console.log('📨 收到后端文本消息:', messageData)
        }
      }
      
    } catch (error) {
      console.error('❌ 处理WebSocket消息失败:', error, event.data)
    }
  }

  /**
   * 处理用户信息不完整的情况
   */
  private handleUserInfoIncomplete(): void {
    console.log('⚠️ 用户信息不完整，需要完善')
    
    // 触发用户信息不完整事件
    this.eventHandlers.userInfoIncomplete?.()
    
    // 触发特定的消息处理器
    const handlers = this.messageHandlers.get('USER_INFO_INCOMPLETE')
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler({ type: 'USER_INFO_INCOMPLETE', data: { code: '8888', message: '用户信息不完整' } } as any)
        } catch (error) {
          console.error('❌ 用户信息不完整处理器错误:', error)
        }
      })
    }
  }

  /**
   * 处理用户信息完整的情况
   */
  private handleUserInfoComplete(): void {
    console.log('✅ 用户信息完整')
    
    // 触发用户信息完整事件
    this.eventHandlers.userInfoComplete?.()
    
    // 触发特定的消息处理器
    const handlers = this.messageHandlers.get('USER_INFO_COMPLETE')
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler({ type: 'USER_INFO_COMPLETE', data: { code: '666', message: '用户信息完整' } } as any)
        } catch (error) {
          console.error('❌ 用户信息完整处理器错误:', error)
        }
      })
    }
  }

  /**
   * 发送用户信息检查请求
   */
  checkUserInfo(): void {
    if (this.status === WebSocketStatus.CONNECTED && this.ws) {
      try {
        // 发送任意消息触发后端检查
        this.ws.send('CHECK_USER_INFO')
        console.log('📤 发送用户信息检查请求')
      } catch (error) {
        console.error('❌ 发送用户信息检查请求失败:', error)
      }
    } else {
      console.warn('⚠️ WebSocket未连接，无法检查用户信息')
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    
    this.heartbeatTimer = window.setInterval(() => {
      if (this.status === WebSocketStatus.CONNECTED) {
        this.send({
          type: 'PING',
          data: { timestamp: Date.now() }
        })
      }
    }, 60000) // 增加到60秒，减少心跳频率
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('❌ 达到最大重连次数，停止重连')
      return
    }

    this.reconnectAttempts++
    this.status = WebSocketStatus.RECONNECTING
    
    console.log(`🔄 计划重连 (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`)
    
    // 指数退避算法
    const delay = Math.min(this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000)
    
    this.reconnectTimer = window.setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ 重连失败:', error)
      })
    }, delay)
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private sendQueuedMessages(): void {
    if (this.messageQueue.length > 0) {
      console.log(`📤 发送队列中的 ${this.messageQueue.length} 条消息`)
      
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()!
        this.send(message)
      }
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// 导出单例实例
export const webSocketManager = new WebSocketManager()
