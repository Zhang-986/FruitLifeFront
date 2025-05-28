import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { webSocketManager } from '@/services/websocket'
import { WebSocketStatus } from '@/types/websocket'
import { AuthManager } from '@/utils/auth-manager' // 添加导入

export const useWebSocketStore = defineStore('websocket', () => {
  // 连接状态
  const connectionStatus = ref<WebSocketStatus>(WebSocketStatus.DISCONNECTED)
  const reconnectAttempts = ref(0)
  const lastError = ref<string | null>(null)
  
  // 用户信息状态
  const isUserInfoComplete = ref<boolean | null>(null)
  const showInfoNotification = ref(false)
  const notificationMessage = ref('')
  const notificationType = ref<'info' | 'success'>('info')
  
  // 添加计数器和完成状态
  const incompleteCount = ref(0) // 8888消息计数
  const maxIncompleteAttempts = 3 // 最大尝试次数
  const sessionCompleted = ref(false) // 会话是否完成（收到666或达到最大次数）
  
  // 计算属性
  const isConnected = computed(() => connectionStatus.value === WebSocketStatus.CONNECTED)
  const isConnecting = computed(() => connectionStatus.value === WebSocketStatus.CONNECTING)
  const isReconnecting = computed(() => connectionStatus.value === WebSocketStatus.RECONNECTING)
  const hasError = computed(() => connectionStatus.value === WebSocketStatus.ERROR)

  // 初始化
  const initialize = async () => {
    try {
      // 检查用户是否已登录
      if (!AuthManager.isLoggedIn()) {
        console.warn('⚠️ 用户未登录，无法初始化WebSocket')
        return
      }

      console.log('🚀 开始初始化WebSocket会话')
      
      // 重置会话状态
      resetSessionState()
      
      setupWebSocketEventListeners()
      await webSocketManager.connect()
    } catch (error) {
      lastError.value = error instanceof Error ? error.message : '初始化失败'
      connectionStatus.value = WebSocketStatus.ERROR
    }
  }

  // 重置会话状态
  const resetSessionState = () => {
    incompleteCount.value = 0
    sessionCompleted.value = false
    console.log('🔄 重置WebSocket会话状态')
  }

  // 显示用户信息通知
  const showUserInfoNotification = (isComplete: boolean) => {
    console.log('🔔 显示用户信息通知:', isComplete)
    
    isUserInfoComplete.value = isComplete
    
    if (isComplete) {
      notificationMessage.value = '🎉 资料完善啦！开启你的水果之旅吧'
      notificationType.value = 'success'
      
      // 收到666，标记会话完成并断开连接
      sessionCompleted.value = true
      console.log('✅ 用户信息完整，会话完成，准备断开WebSocket')
      
      // 延迟断开，让用户看到通知
      setTimeout(() => {
        disconnect()
        console.log('🔌 WebSocket已断开（用户信息完整）')
      }, 2000)
      
    } else {
      incompleteCount.value++
      console.log(`📝 用户信息不完整 (${incompleteCount.value}/${maxIncompleteAttempts})`)
      
      if (incompleteCount.value >= maxIncompleteAttempts) {
        notificationMessage.value = '📝 已多次提醒完善资料，请稍后再试'
        sessionCompleted.value = true
        console.log('⚠️ 达到最大提醒次数，会话完成')
        
        // 延迟断开
        setTimeout(() => {
          disconnect()
          console.log('🔌 WebSocket已断开（达到最大提醒次数）')
        }, 5000)
      } else {
        notificationMessage.value = '📝 完善个人资料，享受更贴心的水果推荐'
      }
      notificationType.value = 'info'
    }
    
    showInfoNotification.value = true
    console.log('🔔 通知状态已设置:', showInfoNotification.value)
    
    // 优化自动隐藏时间
    const hideDelay = isComplete ? 4000 : (incompleteCount.value >= maxIncompleteAttempts ? 8000 : 6000)
    setTimeout(() => {
      showInfoNotification.value = false
      console.log('🔔 通知自动隐藏')
    }, hideDelay)
  }

  // 手动关闭通知
  const dismissNotification = () => {
    showInfoNotification.value = false
  }

  // 连接管理
  const connect = async () => {
    try {
      await webSocketManager.connect()
    } catch (error) {
      lastError.value = error instanceof Error ? error.message : '连接失败'
      throw error
    }
  }

  const disconnect = () => {
    webSocketManager.disconnect()
    resetState()
  }

  // 修改退出登录处理方法
  const handleLogout = async () => {
    console.log('🚪 WebSocket处理用户退出登录')
    
    try {
      // 立即断开WebSocket连接
      webSocketManager.disconnect()
      
      // 重置所有WebSocket状态
      resetState()
      
      // 确保AuthManager退出登录完成
      await AuthManager.logout()
      
      // 同时调用auth store的退出方法确保状态同步
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()
      await authStore.logout()
      
      console.log('✅ WebSocket退出登录完成，所有状态已清除')
    } catch (error) {
      console.error('❌ WebSocket退出登录时发生错误:', error)
      // 即使出错也要重置状态
      resetState()
      
      // 强制清除localStorage
      localStorage.clear()
    }
  }

  // 重置状态
  const resetState = () => {
    connectionStatus.value = WebSocketStatus.DISCONNECTED
    reconnectAttempts.value = 0
    lastError.value = null
    isUserInfoComplete.value = null
    showInfoNotification.value = false
    notificationMessage.value = ''
    resetSessionState()
  }

  // 私有方法
  const setupWebSocketEventListeners = () => {
    webSocketManager.on('connected', () => {
      connectionStatus.value = WebSocketStatus.CONNECTED
      lastError.value = null
      reconnectAttempts.value = 0
      console.log('✅ WebSocket连接成功，状态已更新')
    })

    webSocketManager.on('disconnected', (reason) => {
      connectionStatus.value = WebSocketStatus.DISCONNECTED
      if (reason) {
        lastError.value = reason
      }
    })

    webSocketManager.on('reconnecting', (attempt) => {
      connectionStatus.value = WebSocketStatus.RECONNECTING
      reconnectAttempts.value = attempt
    })

    webSocketManager.on('error', (error) => {
      connectionStatus.value = WebSocketStatus.ERROR
      lastError.value = error.message
    })

    // 监听用户信息状态
    webSocketManager.on('userInfoIncomplete', () => {
      console.log('📨 收到用户信息不完整事件')
      
      // 检查会话是否已完成
      if (sessionCompleted.value) {
        console.log('⚠️ 会话已完成，忽略后续8888消息')
        return
      }
      
      showUserInfoNotification(false)
    })

    webSocketManager.on('userInfoComplete', () => {
      console.log('📨 收到用户信息完整事件')
      
      // 无论何时收到666都处理
      showUserInfoNotification(true)
    })
  }

  // 添加检查是否应该启动会话的方法
  const shouldStartSession = (): boolean => {
    return AuthManager.isLoggedIn() && !sessionCompleted.value
  }

  return {
    // 状态
    connectionStatus: computed(() => connectionStatus.value),
    reconnectAttempts: computed(() => reconnectAttempts.value),
    lastError: computed(() => lastError.value),
    
    // 计算属性
    isConnected,
    isConnecting,
    isReconnecting,
    hasError,
    
    // 用户信息状态
    isUserInfoComplete: computed(() => isUserInfoComplete.value),
    showInfoNotification: computed(() => showInfoNotification.value),
    notificationMessage: computed(() => notificationMessage.value),
    notificationType: computed(() => notificationType.value),
    
    // 会话状态
    incompleteCount: computed(() => incompleteCount.value),
    sessionCompleted: computed(() => sessionCompleted.value),
    
    // 方法
    initialize,
    connect,
    disconnect,
    handleLogout, // 现在是异步方法
    dismissNotification,
    resetState,
    resetSessionState,
    shouldStartSession,
    
    // 添加测试方法（仅开发环境）
    ...(import.meta.env.DEV && {
      testNotification: (isComplete: boolean) => {
        console.log('🧪 测试通知:', isComplete)
        showUserInfoNotification(isComplete)
      }
    })
  }
})
