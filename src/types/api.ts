// 后端统一返回结果类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 用户相关接口类型
export interface RegisterRequest {
  email: string
  password: string
  verificationCode: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserInfo {
  id: number
  email: string
  nickname?: string
  avatar?: string
  createTime?: string
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
