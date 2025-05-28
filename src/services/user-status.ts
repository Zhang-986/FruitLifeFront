import { webSocketManager } from './websocket'
import { AuthManager } from '@/utils/auth-manager'
import type { 
  UserInfoStatusMessage, 
  CompleteInfoReminderMessage 
} from '@/types/websocket'

/**
 * 用户状态管理服务
 * 处理用户信息完整度检查和相关业务逻辑
 */
export class UserStatusService {
  private static instance: UserStatusService
  private isInitialized = false
  private onInfoIncompleteCallback?: (status: UserInfoStatusMessage['data']) => void
  private onReminderCallback?: (reminder: CompleteInfoReminderMessage['data']) => void

  static getInstance(): UserStatusService {
    if (!UserStatusService.instance) {
      UserStatusService.instance = new UserStatusService()
    }
    return UserStatusService.instance
  }

  /**
   * 初始化用户状态服务
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    console.log('🚀 初始化用户状态服务')

    // 注册WebSocket消息处理器
    this.registerMessageHandlers()

    // 建立WebSocket连接
    try {
      await webSocketManager.connect()
      console.log('✅ 用户状态服务初始化完成')
      this.isInitialized = true
    } catch (error) {
      console.error('❌ 用户状态服务初始化失败:', error)
      throw error
    }
  }

  /**
   * 检查用户信息完整度
   */
  async checkUserInfo(): Promise<void> {
    if (!AuthManager.isLoggedIn()) {
      console.warn('❌ 用户未登录，无法检查用户信息')
      return
    }

    const userInfo = AuthManager.getUserInfo()
    if (!userInfo) {
      console.warn('❌ 无法获取用户信息')
      return
    }

    console.log('🔍 检查用户信息完整度...')

    // 发送检查用户信息的消息
    webSocketManager.send({
      type: 'CHECK_USER_INFO',
      data: {
        userId: userInfo.email, // 暂时使用email作为userId
        email: userInfo.email
      }
    })
  }

  /**
   * 设置信息不完整时的回调
   */
  onInfoIncomplete(callback: (status: UserInfoStatusMessage['data']) => void): void {
    this.onInfoIncompleteCallback = callback
  }

  /**
   * 设置收到提醒时的回调
   */
  onReminder(callback: (reminder: CompleteInfoReminderMessage['data']) => void): void {
    this.onReminderCallback = callback
  }

  /**
   * 通知用户信息已更新
   */
  notifyUserInfoUpdated(field: string, value: any): void {
    webSocketManager.send({
      type: 'UPDATE_USER_INFO',
      data: {
        field,
        value
      }
    })
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    console.log('🔌 销毁用户状态服务')
    webSocketManager.disconnect()
    this.isInitialized = false
    this.onInfoIncompleteCallback = undefined
    this.onReminderCallback = undefined
  }

  /**
   * 获取服务状态
   */
  isReady(): boolean {
    return this.isInitialized && webSocketManager.isConnected()
  }

  // 私有方法

  private registerMessageHandlers(): void {
    // 处理用户信息状态消息
    webSocketManager.onMessage('USER_INFO_STATUS', (message: UserInfoStatusMessage) => {
      this.handleUserInfoStatus(message.data)
    })

    // 处理完善信息提醒消息
    webSocketManager.onMessage('COMPLETE_INFO_REMINDER', (message: CompleteInfoReminderMessage) => {
      this.handleCompleteInfoReminder(message.data)
    })

    // 处理系统通知
    webSocketManager.onMessage('SYSTEM_NOTIFICATION', (message) => {
      this.handleSystemNotification(message.data)
    })

    // 处理错误消息
    webSocketManager.onMessage('ERROR', (message) => {
      console.error('❌ 收到服务器错误消息:', message.data)
    })
  }

  private handleUserInfoStatus(status: UserInfoStatusMessage['data']): void {
    console.log('📊 用户信息状态:', status)

    if (!status.isComplete) {
      console.log('⚠️ 用户信息不完整，缺失字段:', status.missingFields)
      console.log('📈 完成度:', `${status.completionRate}%`)
      
      // 触发回调
      this.onInfoIncompleteCallback?.(status)
    } else {
      console.log('✅ 用户信息已完整')
    }
  }

  private handleCompleteInfoReminder(reminder: CompleteInfoReminderMessage['data']): void {
    console.log('🔔 收到完善信息提醒:', reminder)
    
    // 触发回调
    this.onReminderCallback?.(reminder)
  }

  private handleSystemNotification(notification: any): void {
    console.log('📢 系统通知:', notification)
    
    // 这里可以集成到全局通知系统
    // 例如显示toast、弹窗等
  }
}

// 导出单例实例
export const userStatusService = UserStatusService.getInstance()
