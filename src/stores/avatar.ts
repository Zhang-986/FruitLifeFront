import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AvatarConfig {
  type: 'letter' | 'emoji' | 'fruit' | 'color'  // 添加emoji类型
  fruit?: string
  color?: string
  emoji?: string  // 保存原始emoji
}

export const useAvatarStore = defineStore('avatar', () => {
  // 状态
  const avatarConfig = ref<AvatarConfig>({
    type: 'letter',
    color: 'primary'
  })
  
  // 计算属性
  const currentAvatarType = computed(() => avatarConfig.value.type)
  
  // 私有方法：保存到localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('avatar_config', JSON.stringify(avatarConfig.value))
      console.log('💾 头像配置已保存到localStorage:', avatarConfig.value)
    } catch (error) {
      console.error('❌ 保存头像配置失败:', error)
    }
  }
  
  // 初始化头像配置（从localStorage恢复）
  const initializeAvatar = () => {
    const saved = localStorage.getItem('avatar_config')
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved)
        avatarConfig.value = parsedConfig
        console.log('✅ 恢复头像配置:', parsedConfig)
      } catch (error) {
        console.warn('⚠️ 头像配置解析失败', error)
        avatarConfig.value = {
          type: 'letter',
          color: 'primary'
        }
      }
    } else {
      // 设置默认头像
      avatarConfig.value = {
        type: 'letter',
        color: 'primary'
      }
      console.log('🎯 使用默认头像配置')
    }
  }
  
  // 设置emoji头像
  const setEmoji = (emoji: string, color: string = 'primary') => {
    avatarConfig.value = {
      type: 'emoji',
      emoji,
      color
    }
    saveToStorage()
    console.log('🎭 设置emoji头像:', avatarConfig.value)
  }

  // 设置水果头像
  const setFruit = (fruit: string, color: string = 'primary', emoji?: string) => {
    avatarConfig.value = {
      type: 'fruit',
      fruit,
      color,
      emoji // 保存原始emoji
    }
    saveToStorage()
    console.log('🍎 设置水果头像:', avatarConfig.value)
  }

  // 设置字母头像
  const setLetter = (color: string = 'primary') => {
    avatarConfig.value = {
      type: 'letter',
      color
    }
    saveToStorage()
    console.log('🔤 设置字母头像:', avatarConfig.value)
  }

  // 设置颜色
  const setColor = (color: string) => {
    avatarConfig.value = {
      ...avatarConfig.value,
      color
    }
    saveToStorage()
    console.log('🎨 更新头像颜色:', color)
  }

  // 清除头像配置
  const clearAvatar = () => {
    avatarConfig.value = {
      type: 'letter',
      color: 'primary'
    }
    localStorage.removeItem('avatar_config')
    console.log('🗑️ 清除头像配置')
  }
  
  // 更新头像配置
  const updateAvatar = (config: AvatarConfig) => {
    avatarConfig.value = { ...config }
    saveToStorage()
    console.log('✅ 头像配置已更新:', avatarConfig.value)
  }
  
  // 获取头像配置
  const getAvatarConfig = () => {
    return avatarConfig.value
  }

  return {
    // 状态
    avatarConfig,
    // 计算属性
    currentAvatarType,
    // 方法
    initializeAvatar,
    updateAvatar,
    getAvatarConfig,
    clearAvatar,
    setEmoji,    // 新增
    setFruit,
    setLetter,
    setColor
  }
})
