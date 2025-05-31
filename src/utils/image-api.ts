/**
 * 图片API工具类
 * 支持多个免费图片服务
 */

// Unsplash配置
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY' // 需要注册获取
const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

// Pixabay配置  
const PIXABAY_API_KEY = 'YOUR_PIXABAY_API_KEY' // 需要注册获取
const PIXABAY_BASE_URL = 'https://pixabay.com/api'

// Pexels配置
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY' // 需要注册获取
const PEXELS_BASE_URL = 'https://api.pexels.com/v1'

// 图片信息接口
export interface ImageInfo {
  url: string
  thumbnailUrl: string
  description?: string
  author?: string
  source: 'unsplash' | 'pixabay' | 'pexels' | 'placeholder'
}

// 水果名称中英文映射
const fruitNameMap: Record<string, string> = {
  '苹果': 'apple',
  '香蕉': 'banana', 
  '橙子': 'orange',
  '葡萄': 'grape',
  '草莓': 'strawberry',
  '猕猴桃': 'kiwi',
  '樱桃': 'cherry',
  '桃子': 'peach',
  '梨': 'pear',
  '菠萝': 'pineapple',
  '西瓜': 'watermelon',
  '芒果': 'mango',
  '柠檬': 'lemon',
  '椰子': 'coconut',
  '石榴': 'pomegranate',
  '火龙果': 'dragon fruit',
  '榴莲': 'durian',
  '荔枝': 'lychee',
  '龙眼': 'longan',
  '人参果': 'pepino melon'
}

/**
 * 获取水果的英文名称
 */
const getFruitEnglishName = (chineseName: string): string => {
  return fruitNameMap[chineseName] || chineseName
}

/**
 * 从Unsplash获取图片
 */
const getUnsplashImage = async (fruitName: string): Promise<ImageInfo | null> => {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    return null
  }

  try {
    const englishName = getFruitEnglishName(fruitName)
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?query=${englishName} fruit&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    if (!response.ok) throw new Error('Unsplash API error')

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0]
      return {
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        description: photo.alt_description || `${fruitName}图片`,
        author: photo.user.name,
        source: 'unsplash'
      }
    }
  } catch (error) {
    console.error('Unsplash API error:', error)
  }
  
  return null
}

/**
 * 从Pixabay获取图片
 */
const getPixabayImage = async (fruitName: string): Promise<ImageInfo | null> => {
  if (!PIXABAY_API_KEY || PIXABAY_API_KEY === 'YOUR_PIXABAY_API_KEY') {
    return null
  }

  try {
    const englishName = getFruitEnglishName(fruitName)
    const response = await fetch(
      `${PIXABAY_BASE_URL}/?key=${PIXABAY_API_KEY}&q=${englishName}+fruit&image_type=photo&per_page=3&min_width=800&min_height=600`
    )

    if (!response.ok) throw new Error('Pixabay API error')

    const data = await response.json()
    
    if (data.hits && data.hits.length > 0) {
      const image = data.hits[0]
      return {
        url: image.largeImageURL,
        thumbnailUrl: image.webformatURL,
        description: `${fruitName}图片`,
        author: image.user,
        source: 'pixabay'
      }
    }
  } catch (error) {
    console.error('Pixabay API error:', error)
  }
  
  return null
}

/**
 * 从Pexels获取图片
 */
const getPexelsImage = async (fruitName: string): Promise<ImageInfo | null> => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
    return null
  }

  try {
    const englishName = getFruitEnglishName(fruitName)
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${englishName} fruit&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    )

    if (!response.ok) throw new Error('Pexels API error')

    const data = await response.json()
    
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0]
      return {
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        description: `${fruitName}图片`,
        author: photo.photographer,
        source: 'pexels'
      }
    }
  } catch (error) {
    console.error('Pexels API error:', error)
  }
  
  return null
}

/**
 * 获取占位符图片（无需API key的备选方案）
 */
const getPlaceholderImage = (fruitName: string): ImageInfo => {
  const englishName = getFruitEnglishName(fruitName)
  
  // 使用免费的占位符服务
  const placeholderServices = [
    // Picsum - 随机美图
    `https://picsum.photos/800/600?random=${Date.now()}`,
    // Lorem Picsum with blur effect
    `https://picsum.photos/800/600?blur=2&random=${Date.now()}`,
    // 简单的颜色占位符
    `https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=${encodeURIComponent(fruitName)}`
  ]
  
  const randomIndex = Math.floor(Math.random() * placeholderServices.length)
  const placeholderUrl = placeholderServices[randomIndex]
  
  return {
    url: placeholderUrl,
    thumbnailUrl: placeholderUrl,
    description: `${fruitName}占位图`,
    source: 'placeholder'
  }
}

/**
 * 主要的图片获取函数 - 依次尝试多个服务
 */
export const getFruitImage = async (fruitName: string): Promise<ImageInfo> => {
  console.log(`🖼️ 开始获取水果图片: ${fruitName}`)
  
  // 依次尝试各个图片服务
  const imageServices = [
    getUnsplashImage,
    getPixabayImage, 
    getPexelsImage
  ]
  
  for (const service of imageServices) {
    try {
      const result = await service(fruitName)
      if (result) {
        console.log(`✅ 成功获取图片:`, result)
        return result
      }
    } catch (error) {
      console.warn(`⚠️ 图片服务调用失败:`, error)
      continue
    }
  }
  
  // 如果所有服务都失败，返回占位符图片
  console.log(`🔄 使用占位符图片: ${fruitName}`)
  return getPlaceholderImage(fruitName)
}

/**
 * 批量获取多个水果图片
 */
export const getBatchFruitImages = async (fruitNames: string[]): Promise<Record<string, ImageInfo>> => {
  console.log(`🖼️ 批量获取图片:`, fruitNames)
  
  const results: Record<string, ImageInfo> = {}
  
  // 并发获取图片，但限制并发数量避免API限制
  const batchSize = 3
  for (let i = 0; i < fruitNames.length; i += batchSize) {
    const batch = fruitNames.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (fruitName) => {
      const image = await getFruitImage(fruitName)
      return { fruitName, image }
    })
    
    const batchResults = await Promise.all(batchPromises)
    
    batchResults.forEach(({ fruitName, image }) => {
      results[fruitName] = image
    })
    
    // 避免API限制，批次间暂停
    if (i + batchSize < fruitNames.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  return results
}

/**
 * 预设的一些流行水果图片（作为备选）
 */
export const getPresetFruitImages = (): Record<string, string> => {
  return {
    '苹果': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
    '香蕉': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    '橙子': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
    '草莓': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
    '葡萄': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
    '猕猴桃': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800',
    '樱桃': 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800',
    '桃子': 'https://images.unsplash.com/photo-1629828430760-e1ca0ba35a8d?w=800',
    '菠萝': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800',
    '西瓜': 'https://images.unsplash.com/photo-1515594467324-eec77f71b4f6?w=800'
  }
}
