import { http } from '@/utils/http'

// 任务类型定义
export interface Task {
  id?: number
  title: string
  description?: string
  points: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

// 分页请求参数
export interface PageRequestDTO {
  pageNum: number
  pageSize: number
}

// 分页响应类型
export interface PageInfo<T> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
}

// 统一响应类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/**
 * 添加任务
 */
export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<string>> => {
  console.log('📝 调用添加任务API (原始前端数据):', task) // 当是新任务时, task.isActive 是 true
  
  // 后端期望 isActive 是 Integer (0 或 1)
  const taskPayload = {
    ...task,
    isActive: task.isActive ? 1 : 0, // true 会被转换为 1
    // points 字段前端是 number，后端是 Long，通常JSON序列化和Java反序列化可以处理好数字类型转换
  };
  
  console.log('📦 准备发送到后端的任务数据 (处理后):', taskPayload); // taskPayload.isActive 会是 1
  return http.post('/task/addTask', taskPayload)
}

/**
 * 用户查询任务（获取所有激活任务）
 */
export const getTask = (): Promise<ApiResponse<Task[]>> => {
  console.log('📋 调用用户查询任务API')
  return http.get('/task/getTask')
}

/**
 * 编辑任务
 */
export const editTask = (task: Task): Promise<ApiResponse<string>> => {
  console.log('✏️ 调用编辑任务API (原始前端数据):', task);

  // 后端期望 isActive 是 Integer (0 或 1)
  // 同时确保其他字段也符合后端 Tasks 实体的期望
  const taskPayload = {
    id: task.id, // 编辑时必须有id
    title: task.title,
    description: task.description || '', // 确保 description 不为 undefined
    points: task.points,
    isActive: task.isActive ? 1 : 0, // 将 boolean 转换为 integer
    // createdAt 和 updatedAt 通常由后端管理，编辑时不应由前端发送
  };

  console.log('📦 准备发送到后端的编辑任务数据 (处理后):', taskPayload);
  return http.put('/task/editTask', taskPayload);
}

/**
 * 删除任务
 */
export const deleteTask = (id: number): Promise<ApiResponse<string>> => {
  console.log('🗑️ 调用删除任务API, ID:', id)
  return http.delete(`/task/deleteTask/${id}`)
}

/**
 * 管理员查询所有任务（分页）
 */
export const getAllTask = (params: PageRequestDTO): Promise<ApiResponse<PageInfo<Task>>> => {
  console.log('👑 调用管理员查询任务API:', params)
  return http.get('/task/getAllTask', { params })
}

// 导出所有任务相关API
export default {
  addTask,
  getTask,
  editTask,
  deleteTask,
  getAllTask
}
