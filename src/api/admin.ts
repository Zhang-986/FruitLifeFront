import { http } from '@/utils/http'

// API 响应类型
export interface AdminResponse {
  code: number
  msg: string
  data?: string
  success: boolean
}

/**
 * 检查用户是否为管理员
 */
export const checkAdminStatus = async (email: string): Promise<AdminResponse> => {
  try {
    const response = await http.get(`/user/getAdmin/${email}`)
    return response
  } catch (error) {
    throw error
  }
}
