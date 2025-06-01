import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'

// Vuetify 样式
import 'vuetify/styles'
// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// 创建应用实例
const app = createApp(App)

// 创建 Pinia store
const pinia = createPinia()

// 创建 Vuetify 实例 - 恢复你的绿色主题
const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#4CAF50',     // 绿色主题
                    secondary: '#8BC34A',
                    accent: '#CDDC39',
                    error: '#F44336',
                    warning: '#FF9800',
                    info: '#2196F3',
                    success: '#4CAF50'
                }
            }
        }
    },
    icons: {
        defaultSet: 'mdi'
    }
})

// 使用插件
app.use(pinia)
app.use(router)
app.use(vuetify)

// 挂载应用
app.mount('#app')

// 开发环境调试信息
if (import.meta.env.DEV) {
    console.log('🌱 开发环境已启动')
    console.log('📱 水果生活前端应用已加载')
    console.log('🧹 生产构建优化：开发工具已清理')
    console.log('🍃 绿色水果主题已恢复')
}
