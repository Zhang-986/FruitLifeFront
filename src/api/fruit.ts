import { http } from '@/utils/http'

// 水果实体类型定义 - 与后端Fruits PO类字段完全一致
export interface Fruit {
  id?: number
  name: string
  description?: string
  nutritionSummary?: string    // 对应 nutrition_summary
  flavorProfile?: string       // 对应 flavor_profile
  imageUrl?: string           // 对应 image_url
  seasonInfo?: string         // 对应 season_info
  selectionTips?: string      // 对应 selection_tips
  storageTips?: string        // 对应 storage_tips
  eatingTaboos?: string       // 对应 eating_taboos
  culturalSignificance?: string // 对应 cultural_significance
  lifeProperties?: string     // 对应后端String类型，JSON数组字符串
  createdAt?: string          // 对应 created_at
  updatedAt?: string          // 对应 updated_at
}

// 分页请求参数
export interface PageRequestDTO {
  pageNum: number
  pageSize: number
  keyword?: string  // 可选的搜索关键词
}

// 分页响应数据
export interface PageInfo<T> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
  success: boolean
}

/**
 * 添加水果 - 修复接口路径，与后端完全匹配
 */
export const addFruit = async (fruit: Fruit): Promise<ApiResponse> => {
  console.log('🍎 发送添加水果请求:', fruit)
  
  try {
    // 确保数据完整性，字段名与后端Fruits实体完全一致
    const requestData = {
      name: fruit.name,
      description: fruit.description || '',
      nutritionSummary: fruit.nutritionSummary || '',
      flavorProfile: fruit.flavorProfile || '',
      imageUrl: fruit.imageUrl || '',
      seasonInfo: fruit.seasonInfo || '',
      selectionTips: fruit.selectionTips || '',
      storageTips: fruit.storageTips || '',
      eatingTaboos: fruit.eatingTaboos || '',              // 确保包含
      culturalSignificance: fruit.culturalSignificance || '', // 确保包含
      lifeProperties: fruit.lifeProperties || ''            // String类型JSON
    }
    
    console.log('📤 发送到后端的数据 (与Fruits实体匹配):', requestData)
    console.log('📍 后端接口: POST /fruit/addFruit')
    console.log('📋 后端实体: Fruits.java')
    
    // 修复：使用正确的后端接口路径
    const response = await http.post('/fruit/addFruit', requestData)
    console.log('✅ 添加水果成功:', response)
    return response
  } catch (error) {
    console.error('❌ 添加水果失败:', error)
    throw error
  }
}

/**
 * 删除水果
 */
export const deleteFruit = async (id: number): Promise<ApiResponse> => {
  console.log('🗑️ 发送删除水果请求, ID:', id)
  
  try {
    const response = await http.delete(`/fruit/deleteFruit/${id}`)
    console.log('✅ 删除水果成功:', response)
    return response
  } catch (error) {
    console.error('❌ 删除水果失败:', error)
    throw error
  }
}

/**
 * 获取单个水果信息
 */
export const getFruit = async (id: number): Promise<ApiResponse<Fruit>> => {
  console.log('🔍 发送获取水果请求, ID:', id)
  
  try {
    const response = await http.get(`/fruit/getFruit/${id}`)
    console.log('✅ 获取水果信息成功:', response)
    return response
  } catch (error) {
    console.error('❌ 获取水果信息失败:', error)
    throw error
  }
}

/**
 * 更新水果信息
 */
export const updateFruit = async (fruit: Fruit): Promise<ApiResponse> => {
  console.log('🔄 发送更新水果请求:', fruit)
  
  try {
    // 确保更新数据与Fruits实体字段完全匹配
    const requestData = {
      id: fruit.id,  // 更新时需要ID
      name: fruit.name,
      description: fruit.description || '',
      nutritionSummary: fruit.nutritionSummary || '',
      flavorProfile: fruit.flavorProfile || '',
      imageUrl: fruit.imageUrl || '',
      seasonInfo: fruit.seasonInfo || '',
      selectionTips: fruit.selectionTips || '',
      storageTips: fruit.storageTips || '',
      eatingTaboos: fruit.eatingTaboos || '',
      culturalSignificance: fruit.culturalSignificance || '',
      lifeProperties: fruit.lifeProperties || ''
    }
    
    console.log('📤 发送更新数据 (与Fruits实体匹配):', requestData)
    
    const response = await http.put('/fruit/updateFruit', requestData)
    console.log('✅ 更新水果成功:', response)
    return response
  } catch (error) {
    console.error('❌ 更新水果失败:', error)
    throw error
  }
}

/**
 * 分页查询水果列表
 */
export const getFruits = async (params: PageRequestDTO): Promise<ApiResponse<PageInfo<Fruit>>> => {
  console.log('🔍 发送分页查询水果请求:', params)
  
  try {
    // 构建查询参数
    const queryParams: any = {
      pageNum: params.pageNum,
      pageSize: params.pageSize
    }
    
    // 只有当 keyword 存在且不为空时才添加到查询参数中
    if (params.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim()
      console.log('📤 包含搜索关键词:', queryParams.keyword)
    }
    
    console.log('📦 最终查询参数:', queryParams)
    console.log('📍 请求URL: GET /fruit/getFruits')
    
    const response = await http.get<ApiResponse<PageInfo<Fruit>>>('/fruit/getFruits', {
      params: queryParams
    })
    
    console.log('✅ 分页查询水果成功:', response)
    
    return response
  } catch (error) {
    console.error('❌ 分页查询水果失败:', error)
    throw error
  }
}

/**
 * 根据名称查询单个水果
 */
export const getFruitByName = async (name: string): Promise<ApiResponse<Fruit>> => {
  return http.get('/fruit/getFruitByName', {
    params: { name }
  })
}
