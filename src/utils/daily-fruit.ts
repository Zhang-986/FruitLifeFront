/**
 * 每日水果推荐工具类
 * 基于日期生成每日推荐的水果名称
 */

// 水果名称池 - 确保这些水果在后端数据库中存在
const FRUIT_POOL = [
  '苹果', '香蕉', '橙子', '葡萄', '草莓', '西瓜', '猕猴桃', '菠萝',
  '芒果', '樱桃', '桃子', '梨', '柠檬', '蓝莓', '火龙果', '榴莲',
  '荔枝', '龙眼', '椰子', '柚子', '石榴', '山竹', '百香果', '牛油果',
  '无花果', '杨梅', '枇杷', '柿子', '哈密瓜', '木瓜', '番石榴'
]

/**
 * 获取今日推荐的水果名称
 * 基于当前日期生成，确保同一天返回相同的水果
 */
export const getTodayFruitName = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  
  // 使用年月日创建种子，确保每天都有固定的推荐
  const seed = year * 10000 + month * 100 + day
  
  // 使用简单的伪随机算法
  const index = seed % FRUIT_POOL.length
  
  return FRUIT_POOL[index]
}

/**
 * 获取日期字符串，用于缓存key
 */
export const getTodayDateString = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0] // YYYY-MM-DD格式
}

/**
 * 检查是否是新的一天（用于清除缓存）
 */
export const isNewDay = (lastDate: string): boolean => {
  return getTodayDateString() !== lastDate
}
