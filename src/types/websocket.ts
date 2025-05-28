/**
 * WebSocket消息类型定义
 */

// 消息基础接口
export interface BaseMessage {
  type: string
  timestamp?: number
  requestId?: string
}

// 前端发送给后端的消息类型
export type ClientMessage = 
  | CheckUserInfoMessage
  | PingMessage
  | UpdateUserInfoMessage
  | TestMessage

// 用户信息状态消息
export interface UserInfoIncompleteMessage extends BaseMessage {
  type: 'USER_INFO_INCOMPLETE'
  data: {
    code: string
    message: string
  }
}

export interface UserInfoCompleteMessage extends BaseMessage {
  type: 'USER_INFO_COMPLETE'
  data: {
    code: string
    message: string
  }
}

// 后端发送给前端的消息类型
export type ServerMessage = 
  | UserInfoStatusMessage
  | CompleteInfoReminderMessage
  | PongMessage
  | ErrorMessage
  | SystemNotificationMessage
  | UserInfoIncompleteMessage  // 新增
  | UserInfoCompleteMessage    // 新增
  | TestResponseMessage

// 检查用户信息
export interface CheckUserInfoMessage extends BaseMessage {
  type: 'CHECK_USER_INFO'
  data: {
    userId: string
    email: string
  }
}

// 心跳包
export interface PingMessage extends BaseMessage {
  type: 'PING'
  data: {
    timestamp: number
  }
}

// 用户信息更新通知
export interface UpdateUserInfoMessage extends BaseMessage {
  type: 'UPDATE_USER_INFO'
  data: {
    field: string
    value: any
  }
}

// 用户信息状态响应
export interface UserInfoStatusMessage extends BaseMessage {
  type: 'USER_INFO_STATUS'
  data: {
    isComplete: boolean
    missingFields: string[]
    completionRate: number
    requiredFields: {
      field: string
      label: string
      type: 'string' | 'number' | 'select'
      options?: string[]
    }[]
  }
}

// 完善信息提醒
export interface CompleteInfoReminderMessage extends BaseMessage {
  type: 'COMPLETE_INFO_REMINDER'
  data: {
    message: string
    urgency: 'low' | 'medium' | 'high'
    action?: {
      label: string
      route: string
    }
  }
}

// 心跳响应
export interface PongMessage extends BaseMessage {
  type: 'PONG'
  data: {
    timestamp: number
  }
}

// 错误消息
export interface ErrorMessage extends BaseMessage {
  type: 'ERROR'
  data: {
    code: string
    message: string
    details?: any
  }
}

// 系统通知
export interface SystemNotificationMessage extends BaseMessage {
  type: 'SYSTEM_NOTIFICATION'
  data: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    autoClose?: boolean
    duration?: number
  }
}

// 测试消息
export interface TestMessage extends BaseMessage {
  type: 'TEST_MESSAGE'
  data: {
    content: string
  }
}

// 测试响应
export interface TestResponseMessage extends BaseMessage {
  type: 'TEST_RESPONSE'
  data: {
    originalMessage: string
    response: string
    serverTime: number
  }
}

// WebSocket连接状态
export enum WebSocketStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// WebSocket配置
export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
  connectionTimeout: number
}

// 消息处理器接口
export interface MessageHandler<T extends ServerMessage = ServerMessage> {
  (message: T): void | Promise<void>
}

// WebSocket事件类型
export interface WebSocketEvents {
  connected: () => void
  disconnected: (reason?: string) => void
  reconnecting: (attempt: number) => void
  error: (error: Error) => void
  message: (message: ServerMessage) => void
  userInfoIncomplete: () => void  // 新增：用户信息不完整事件
  userInfoComplete: () => void    // 新增：用户信息完整事件
}
