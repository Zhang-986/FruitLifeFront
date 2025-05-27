// 后端统一返回结果类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 用户相关接口类型 - 简化为只包含必要字段
export interface RegisterRequest {
  email: string
  password: string
  code: string
}

// 后端GuestSessionsDTO对应的类型
export interface GuestSessionsDTO {
  id?: string
  nickname?: string
  code?: string
  password?: string
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  heightCm?: number
  weightKg?: number
  age?: number
  email?: string
  bmiValue?: number
  createdAt?: Date
  updatedAt?: Date
}

// 验证码相关
export interface VerificationCodeRequest {
  email: string
}

// 常用状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const
