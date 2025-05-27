import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { showConnectionStatus } from '@/utils/backend-check'

const app = createApp(App)

// 检查后端连接状态
if (import.meta.env.DEV) {
  showConnectionStatus()
}

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
