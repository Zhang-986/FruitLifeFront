import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 管理员统计数据接口
export interface AdminStats {
  fruitCount: number      // 水果种类数量
  userCount: number       // 注册用户数量
  pendingOrders: number   // 待处理订单数量
  todaySales: number      // 今日销售额
}

/**
 * 获取管理员统计数据
 */
export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  try {
    // 并行调用多个统计接口
    const [fruitCountRes, userCountRes] = await Promise.all([
      http.get<ApiResponse<number>>('/statistics/getFruitCount'),
      http.get<ApiResponse<number>>('/statistics/getUserCount')
    ])

    // 组装统计数据
    const stats: AdminStats = {
      fruitCount: fruitCountRes.data || 0,
      userCount: userCountRes.data || 0,
      pendingOrders: 89, // 临时数据，等待后端接口  
      todaySales: 12500 // 临时数据，等待后端接口
    }

    return {
      code: 200,
      msg: '获取成功',
      data: stats
    }
  } catch (error: any) {
    console.error('❌ 获取管理员统计数据失败:', error)
    throw error
  }
}
