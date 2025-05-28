import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页 - 果润生活' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue').catch(err => {
        console.error('Failed to load AboutView:', err)
        return import('../views/AboutView.vue')
      }),
      meta: { title: '关于我们 - 果润生活' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue').catch(err => {
        console.error('Failed to load RegisterView:', err)
        return import('../views/RegisterView.vue')
      }),
      meta: { title: '用户注册 - 果润生活' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue').catch(err => {
        console.error('Failed to load LoginView:', err)
        return import('../views/LoginView.vue')
      }),
      meta: { title: '用户登录 - 果润生活' }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue').catch(err => {
        console.error('Failed to load ForgotPasswordView:', err)
        return import('../views/ForgotPasswordView.vue')
      }),
      meta: { title: '找回密码 - 果润生活' }
    },
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue').catch(() => {
        return {
          template: `
            <div style="text-align: center; padding: 50px;">
              <h1>页面未找到</h1>
              <p>抱歉，您访问的页面不存在</p>
              <button @click="$router.push('/')">返回首页</button>
            </div>
          `
        }
      }),
      meta: { title: '页面未找到 - 果润生活' }
    }
  ]
})

// 路由守卫 - 动态设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  } else {
    document.title = '果润生活'
  }
  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
  
  // 如果是动态导入失败，尝试重新导航到首页
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('Dynamic import failed, redirecting to home')
    window.location.href = '/'
  }
})

export default router
