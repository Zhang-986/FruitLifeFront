import type { Router } from 'vue-router'

/**
 * 路由辅助工具
 * 提供安全的路由导航和错误处理
 */
export class RouteHelper {
  private router: Router

  constructor(router: Router) {
    this.router = router
  }

  /**
   * 安全的路由导航
   */
  async safePush(to: string | { name: string; params?: any }) {
    try {
      await this.router.push(to)
    } catch (error: any) {
      console.error('路由导航失败:', error)
      
      // 如果是动态导入失败，尝试刷新页面
      if (error.message?.includes('Failed to fetch dynamically imported module')) {
        console.warn('动态导入失败，将刷新页面')
        window.location.href = typeof to === 'string' ? to : '/'
        return
      }
      
      // 其他错误，导航到首页
      if (this.router.currentRoute.value.path !== '/') {
        this.router.push('/')
      }
    }
  }

  /**
   * 安全的路由替换
   */
  async safeReplace(to: string | { name: string; params?: any }) {
    try {
      await this.router.replace(to)
    } catch (error: any) {
      console.error('路由替换失败:', error)
      window.location.href = typeof to === 'string' ? to : '/'
    }
  }

  /**
   * 重试动态导入
   */
  async retryDynamicImport<T>(importFn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: Error
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await importFn()
      } catch (error: any) {
        lastError = error
        console.warn(`动态导入重试 ${i + 1}/${maxRetries}:`, error)
        
        // 等待一段时间再重试
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }
    
    throw lastError!
  }
}

/**
 * 创建具有重试机制的动态导入函数
 */
export function createRetryableImport(importPath: string) {
  return () => {
    const helper = new RouteHelper(null as any) // 这里不需要router实例
    return helper.retryDynamicImport(() => import(importPath))
  }
}
