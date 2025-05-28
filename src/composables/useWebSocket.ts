import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { webSocketManager } from '@/services/websocket'
import { userStatusService } from '@/services/user-status'
import { WebSocketStatus } from '@/types/websocket'
import type { UserInfoStatusMessage, CompleteInfoReminderMessage } from '@/types/websocket'

/**
 * WebSocket Vue组合式函数
 * 提供响应式的WebSocket状态和用户信息检查功能
 */
export function useWebSocket() {
  const router = useRouter()
  
  // 响应式状态
  const connectionStatus = ref<WebSocketStatus>(WebSocketStatus.DISCONNECTED)
  const isConnected = computed(() => connectionStatus.value === WebSocketStatus.CONNECTED)
  const isConnecting = computed(() => connectionStatus.value === WebSocketStatus.CONNECTING)
  const isReconnecting = computed(() => connectionStatus.value === WebSocketStatus.RECONNECTING)
  
  // 用户信息状态
  const userInfoStatus = ref<UserInfoStatusMessage['data'] | null>(null)
  const isUserInfoComplete = computed(() => userInfoStatus.value?.isComplete ?? true)
  const completionRate = computed(() => userInfoStatus.value?.completionRate ?? 100)
  const missingFields = computed(() => userInfoStatus.value?.missingFields ?? [])
  
  // 提醒信息
  const currentReminder = ref<CompleteInfoReminderMessage['data'] | null>(null)
  const showReminder = ref(false)

  /**
   * 初始化WebSocket连接
   */
  const initialize = async () => {
    try {
      console.log('🚀 初始化WebSocket连接')
      
      // 监听连接状态变化
      webSocketManager.on('connected', () => {
        connectionStatus.value = WebSocketStatus.CONNECTED
        console.log('✅ WebSocket已连接')
        
        // 连接成功后立即检查用户信息
        checkUserInfo()
      })
      
      webSocketManager.on('disconnected', () => {
        connectionStatus.value = WebSocketStatus.DISCONNECTED
        console.log('🔌 WebSocket已断开')
      })
      
      webSocketManager.on('reconnecting', () => {
        connectionStatus.value = WebSocketStatus.RECONNECTING
        console.log('🔄 WebSocket重连中')
      })
      
      webSocketManager.on('error', (error) => {
        connectionStatus.value = WebSocketStatus.ERROR
        console.error('❌ WebSocket错误:', error)
      })
      
      // 初始化用户状态服务
      await userStatusService.initialize()
      
      // 设置用户信息状态回调
      userStatusService.onInfoIncomplete((status) => {
        userInfoStatus.value = status
        
        // 如果信息不完整且完成度很低，显示引导
        if (status.completionRate < 50) {
          showCompletionGuide(status)
        }
      })
      
      // 设置提醒回调
      userStatusService.onReminder((reminder) => {
        currentReminder.value = reminder
        showReminder.value = true
      })
      
    } catch (error) {
      console.error('❌ WebSocket初始化失败:', error)
      connectionStatus.value = WebSocketStatus.ERROR
    }
  }

  /**
   * 检查用户信息
   */
  const checkUserInfo = () => {
    userStatusService.checkUserInfo()
  }

  /**
   * 显示完善信息引导
   */
  const showCompletionGuide = (status: UserInfoStatusMessage['data']) => {
    console.log('🎯 显示信息完善引导')
    
    // 可以在这里添加更复杂的引导逻辑
    // 比如显示模态框、引导用户到特定页面等
    
    // 简单示例：直接跳转到信息完善页面
    setTimeout(() => {
      router.push('/user/profile')
    }, 2000)
  }

  /**
   * 关闭提醒
   */
  const dismissReminder = () => {
    showReminder.value = false
    currentReminder.value = null
  }

  /**
   * 处理提醒操作
   */
  const handleReminderAction = () => {
    if (currentReminder.value?.action) {
      router.push(currentReminder.value.action.route)
      dismissReminder()
    }
  }

  /**
   * 通知信息更新
   */
  const notifyInfoUpdated = (field: string, value: any) => {
    userStatusService.notifyUserInfoUpdated(field, value)
  }

  /**
   * 断开连接
   */
  const disconnect = () => {
    userStatusService.destroy()
    connectionStatus.value = WebSocketStatus.DISCONNECTED
  }

  // 生命周期钩子
  onMounted(() => {
    // 组件挂载时不自动初始化，由使用方决定何时初始化
  })

  onUnmounted(() => {
    // 组件卸载时不自动断开，保持连接供其他组件使用
  })

  return {
    // 状态
    connectionStatus: computed(() => connectionStatus.value),
    isConnected,
    isConnecting,
    isReconnecting,
    
    // 用户信息状态
    userInfoStatus: computed(() => userInfoStatus.value),
    isUserInfoComplete,
    completionRate,
    missingFields,
    
    // 提醒
    currentReminder: computed(() => currentReminder.value),
    showReminder: computed(() => showReminder.value),
    
    // 方法
    initialize,
    checkUserInfo,
    dismissReminder,
    handleReminderAction,
    notifyInfoUpdated,
    disconnect
  }
}

/**
 * 用户信息完善指导组合函数
 * 专门用于处理用户信息完善相关的逻辑
 */
export function useUserInfoGuide() {
  const { 
    userInfoStatus, 
    isUserInfoComplete, 
    completionRate, 
    missingFields 
  } = useWebSocket()
  
  const router = useRouter()
  
  /**
   * 检查是否需要显示完善信息引导
   */
  const shouldShowGuide = computed(() => {
    return !isUserInfoComplete.value && completionRate.value < 50
  })
  
  /**
   * 获取完善信息的提示文本
   */
  const getGuideText = computed(() => {
    const rate = completionRate.value
    if (rate < 30) {
      return '您的个人信息还很不完整，完善信息可以获得更好的服务体验'
    } else if (rate < 60) {
      return '您的个人信息已完成一半，继续完善可享受更多功能'
    } else {
      return '您的信息即将完善，只需要再添加几项信息'
    }
  })
  
  /**
   * 跳转到信息完善页面
   */
  const goToCompleteInfo = () => {
    router.push('/user/profile')
  }
  
  return {
    shouldShowGuide,
    getGuideText,
    completionRate,
    missingFields,
    goToCompleteInfo
  }
}
