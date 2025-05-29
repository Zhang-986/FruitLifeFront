import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

/**
 * 用户信息VO类型定义
 */
export interface UserInfoVo {
  id: number
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN'
  nickname: string
  heightCm: number
  isCompleted: boolean
  weightKg: number
  age: number
  email: string
  bmiValue: number
}

/**
 * 完善资料请求数据类型
 */
export interface CompleteProfileData {
  nickname: string
  age?: number
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  heightCm?: number     // 修复：确保字段名正确
  weightKg?: number     // 修复：确保字段名正确
  isCompleted?: boolean // 修复：确保字段名和类型正确
  bmiValue?: number     // 修复：确保字段名正确
}

/**
 * 获取用户信息
 */
export const getUserInfo = async (): Promise<ApiResponse<UserInfoVo>> => {
  try {
    const response = await http.get<ApiResponse<UserInfoVo>>('/user/getUserInfo')
    
    console.log('🔍 获取用户信息响应:', response)
    
    if (response.code === 200) {
      console.log('✅ 用户信息获取成功:', response.data)
    } else {
      console.log('⚠️ 用户信息获取失败:', response.msg)
    }
    
    return response
  } catch (error: any) {
    console.error('❌ 获取用户信息失败:', error.message || error)
    throw error
  }
}

/**
 * 检查用户信息是否完善
 * 修正：使用正确的后端接口路径
 */
export const checkUserInfoCompleted = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await http.get<ApiResponse<string>>('/user/isCompleted')
    
    console.log('🔍 检查用户信息完善状态响应:', response)
    
    return response
  } catch (error: any) {
    console.error('❌ 检查用户信息完善状态失败:', error.message || error)
    throw error
  }
}

/**
 * 完善用户资料
 */
export const completeProfile = async (data: CompleteProfileData): Promise<ApiResponse<any>> => {
  console.log('🚀 发送完善资料请求:', data)
  
  try {
    const response = await http.post<ApiResponse<any>>('/user/completeProfile', data)
    console.log('📦 完善资料响应:', response)
    return response
  } catch (error: any) {
    console.error('❌ 完善资料请求失败:', error)
    
    // 统一错误处理
    if (error.name === 'BusinessError') {
      throw error
    }
    
    const businessError = new Error(error.message || '完善资料失败，请稍后重试')
    businessError.name = 'BusinessError'
    throw businessError
  }
}
