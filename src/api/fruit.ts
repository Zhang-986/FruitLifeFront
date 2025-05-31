import { http } from '@/utils/http'

// 水果实体类型定义 - 与后端PO类字段保持一致
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
  lifeProperties?: string     // 修改：现在后端是String类型，前端也改为string
  createdAt?: string
  updatedAt?: string
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
 * 添加水果
 */
export const addFruit = async (fruit: Fruit): Promise<ApiResponse> => {
  console.log('🍎 发送添加水果请求:', fruit)
  
  try {
    // 确保数据完整性，处理undefined字段
    const requestData = {
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
      lifeProperties: fruit.lifeProperties || ''  // 修改：现在是字符串
    }
    
    console.log('📤 处理后的请求数据:', requestData)
    
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
    // 修复：确保ID作为路径参数传递
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
    // 确保数据完整性，包含所有字段
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
      lifeProperties: fruit.lifeProperties || ''  // 修改：现在是字符串
    }
    
    console.log('📤 处理后的更新数据:', requestData)
    
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
    const response = await http.get<ApiResponse<PageInfo<Fruit>>>('/fruit/getFruits', {
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        ...(params.keyword && { keyword: params.keyword })
      }
    })
    
    console.log('✅ 分页查询水果成功:', response)
    
    // 移除之前的数据处理逻辑，直接返回原始数据
    // 让组件层面处理生活属性的展示
    
    return response
  } catch (error) {
    console.error('❌ 分页查询水果失败:', error)
    throw error
  }
}
