/**
 * 头像提供者工具类
 * 提供多种头像生成方式，确保在中国大陆可正常访问
 */
export class AvatarProvider {
  // 颜色池
  private readonly colorPool = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
    '#F5B041', '#F7DC6F', '#D35400', '#E67E22', '#1ABC9C',
    '#2ECC71', '#3498DB', '#9B59B6', '#34495E', '#F39C12',
    '#E74C3C', '#8E44AD', '#2980B9', '#27AE60', '#16A085'
  ]

  // 水果池
  private readonly fruitPool = [
    '🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍',
    '🥥', '🍋', '🍈', '🍉', '🥑', '🍅', '🫐', '🍠', '🥕', '🌽',
    '🥦', '🍆', '🥒', '🫑', '🍄', '🥬', '🌶️', '🧄', '🧅', '🥔',
    '🍏', '🍐', '🍋', '🍊', '🍇', '🍉', '🍈', '🍌', '🍍', '🥭'
  ]

  /**
   * 根据文本获取颜色
   */
  getColorForText(text: string): string {
    if (!text) return this.colorPool[0]
    
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const index = Math.abs(hash) % this.colorPool.length
    return this.colorPool[index]
  }

  /**
   * 获取对比色（用于文字显示）
   */
  getContrastColor(backgroundColor: string): string {
    // 移除 # 号
    const hex = backgroundColor.replace('#', '')
    
    // 转换为 RGB
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    
    // 根据亮度返回对比色
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  /**
   * 生成水果头像
   */
  generateFruitAvatar(userId?: number): string {
    const index = userId ? userId % this.fruitPool.length : Math.floor(Math.random() * this.fruitPool.length)
    return this.fruitPool[index]
  }

  /**
   * 生成字母头像
   */
  generateLetterAvatar(text: string): { letter: string; color: string } {
    const letter = text ? text.charAt(0).toUpperCase() : 'U'
    const color = this.getColorForText(text)
    
    return { letter, color }
  }

  /**
   * 生成颜色头像
   */
  generateColorAvatar(): string {
    const randomIndex = Math.floor(Math.random() * this.colorPool.length)
    return this.colorPool[randomIndex]
  }

  /**
   * 根据文本生成头像
   */
  generateAvatar(text: string, type: 'fruit' | 'color' | 'letter' = 'letter'): AvatarInfo {
    if (!text) {
      return this.getDefaultAvatar()
    }

    const hash = this.hashCode(text)
    
    switch (type) {
      case 'fruit':
        return this.getFruitAvatar(hash)
      case 'color':
        return this.getColorAvatar(text, hash)
      case 'letter':
      default:
        return this.getLetterAvatar(text, hash)
    }
  }

  /**
   * 生成字母头像
   */
  private getLetterAvatar(text: string, hash: number): AvatarInfo {
    const letter = text.charAt(0).toUpperCase()
    const colorIndex = Math.abs(hash) % this.colorPool.length
    const backgroundColor = this.colorPool[colorIndex]
    
    return {
      type: 'letter',
      text: letter,
      backgroundColor,
      textColor: this.getContrastColor(backgroundColor),
      url: this.generateLetterAvatarDataURL(letter, backgroundColor)
    }
  }

  /**
   * 生成水果头像
   */
  private getFruitAvatar(hash: number): AvatarInfo {
    const fruitIndex = Math.abs(hash) % this.fruitPool.length
    const fruit = this.fruitPool[fruitIndex]
    
    return {
      type: 'fruit',
      text: fruit,
      backgroundColor: '#F5F5F5',
      textColor: '#333',
      url: this.generateEmojiAvatarDataURL(fruit)
    }
  }

  /**
   * 生成纯色头像
   */
  private getColorAvatar(text: string, hash: number): AvatarInfo {
    const letter = text.charAt(0).toUpperCase()
    const colorIndex = Math.abs(hash) % this.colorPool.length
    const backgroundColor = this.colorPool[colorIndex]
    
    return {
      type: 'color',
      text: letter,
      backgroundColor,
      textColor: this.getContrastColor(backgroundColor),
      url: this.generateGradientAvatarDataURL(letter, backgroundColor)
    }
  }

  /**
   * 获取默认头像
   */
  private getDefaultAvatar(): AvatarInfo {
    return {
      type: 'letter',
      text: '用',
      backgroundColor: '#9E9E9E',
      textColor: '#FFFFFF',
      url: this.generateLetterAvatarDataURL('用', '#9E9E9E')
    }
  }

  /**
   * 生成字符串哈希值
   */
  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash
  }

  /**
   * 生成字母头像的Data URL
   */
  private generateLetterAvatarDataURL(letter: string, backgroundColor: string): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''
    
    const size = 100
    canvas.width = size
    canvas.height = size
    
    // 绘制背景
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)
    
    // 绘制文字
    ctx.fillStyle = this.getContrastColor(backgroundColor)
    ctx.font = 'bold 40px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, size / 2, size / 2)
    
    return canvas.toDataURL()
  }

  /**
   * 生成Emoji头像的Data URL
   */
  private generateEmojiAvatarDataURL(emoji: string): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''
    
    const size = 100
    canvas.width = size
    canvas.height = size
    
    // 绘制背景
    ctx.fillStyle = '#F5F5F5'
    ctx.fillRect(0, 0, size, size)
    
    // 绘制emoji
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, size / 2, size / 2)
    
    return canvas.toDataURL()
  }

  /**
   * 生成渐变头像的Data URL
   */
  private generateGradientAvatarDataURL(letter: string, color: string): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''
    
    const size = 100
    canvas.width = size
    canvas.height = size
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, this.adjustBrightness(color, -20))
    
    // 绘制渐变背景
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    
    // 绘制文字
    ctx.fillStyle = this.getContrastColor(color)
    ctx.font = 'bold 40px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, size / 2, size / 2)
    
    return canvas.toDataURL()
  }

  /**
   * 调整颜色亮度
   */
  private adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                 (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
                 (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  /**
   * 根据用户信息生成头像
   */
  getUserAvatar(userInfo: { email?: string; nickname?: string; id?: number }): AvatarInfo {
    // 优先使用昵称，其次使用邮箱，最后使用ID
    const text = userInfo.nickname || 
                 userInfo.email?.split('@')[0] || 
                 `用户${userInfo.id || ''}`
    
    // 水果生活主题，优先使用水果头像
    return this.generateAvatar(text, 'fruit')
  }

  /**
   * 获取头像预设选项（供用户选择）
   */
  getAvatarPresets(): AvatarPreset[] {
    const presets: AvatarPreset[] = []
    
    // 水果头像预设
    this.fruitPool.forEach((fruit: string, index: number) => {
      presets.push({
        id: `fruit-${index}`,
        name: `水果头像 ${fruit}`,
        type: 'fruit',
        preview: this.generateEmojiAvatarDataURL(fruit),
        data: fruit
      })
    })
    
    // 颜色头像预设
    this.colorPool.forEach((color: string, index: number) => {
      presets.push({
        id: `color-${index}`,
        name: `颜色头像`,
        type: 'color',
        preview: this.generateLetterAvatarDataURL('A', color),
        data: color
      })
    })
    
    return presets
  }
}

/**
 * 头像信息接口
 */
export interface AvatarInfo {
  type: 'letter' | 'fruit' | 'color'
  text: string
  backgroundColor: string
  textColor: string
  url: string
}

/**
 * 头像预设接口
 */
export interface AvatarPreset {
  id: string
  name: string
  type: 'letter' | 'fruit' | 'color'
  preview: string
  data: string
}
