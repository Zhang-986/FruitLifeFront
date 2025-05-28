import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import router from './router'
import App from './App.vue'
import './styles/main.scss'
import { requestInterceptor } from '@/utils/request-interceptor'
import { AuthManager } from '@/utils/auth-manager'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue全局错误:', err, info)
  
  // 如果是动态导入错误，尝试重新加载页面
  if (err instanceof Error && err.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('检测到动态导入失败，将重新加载页面')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

// 全局未捕获的Promise错误
window.addEventListener('unhandledrejection', event => {
  console.error('未捕获的Promise错误:', event.reason)
  
  if (event.reason?.message?.includes('Failed to fetch dynamically imported module')) {
    console.warn('检测到动态导入Promise错误')
    event.preventDefault() // 阻止默认的错误处理
  }
})

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// 初始化认证状态
const authStore = useAuthStore()
authStore.initializeAuth()

// 初始化请求拦截器
if (import.meta.env.DEV) {
  requestInterceptor.initialize().then(() => {
    console.log('🎯 应用已启动，IP拦截器已就绪')
    
    // 显示当前登录状态
    console.log('🔍 应用启动时的登录状态检查:')
    authStore.debugStorage()
  })
}

app.mount('#app')
