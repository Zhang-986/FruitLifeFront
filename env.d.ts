/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展Window接口（如果需要）
declare global {
  interface Window {
    // 在这里添加全局变量类型
  }
}
