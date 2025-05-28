import { createRouter, createWebHistory } from 'vue-router'
import { AuthManager } from '@/utils/auth-manager'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页 - 果润生活', requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue').catch(err => {
        console.error('Failed to load AboutView:', err)
        return import('../views/AboutView.vue')
      }),
      meta: { title: '关于我们 - 果润生活', requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue').catch(err => {
        console.error('Failed to load RegisterView:', err)
        return import('../views/RegisterView.vue')
      }),
      meta: { title: '用户注册 - 果润生活', requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue').catch(err => {
        console.error('Failed to load LoginView:', err)
        return import('../views/LoginView.vue')
      }),
      meta: { title: '用户登录 - 果润生活', requiresAuth: false }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue').catch(err => {
        console.error('Failed to load ForgotPasswordView:', err)
        return import('../views/ForgotPasswordView.vue')
      }),
      meta: { title: '找回密码 - 果润生活', requiresAuth: false }
    },
    // 用户专属区域
    {
      path: '/user',
      name: 'user-dashboard',
      component: () => import('../views/UserDashboard.vue').catch(err => {
        console.error('Failed to load UserDashboard:', err)
        return import('../views/UserDashboard.vue')
      }),
      meta: { title: '用户中心 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/orders',
      name: 'user-orders',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="primary" class="mr-3">mdi-package-variant</v-icon>
                我的订单
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  订单管理功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '我的订单 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/cart',
      name: 'user-cart',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="success" class="mr-3">mdi-cart</v-icon>
                购物车
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  购物车功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '购物车 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="info" class="mr-3">mdi-account-edit</v-icon>
                个人资料
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  个人资料管理功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '个人资料 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/addresses',
      name: 'user-addresses',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="warning" class="mr-3">mdi-map-marker</v-icon>
                收货地址
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  地址管理功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '收货地址 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/favorites',
      name: 'user-favorites',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="pink" class="mr-3">mdi-heart</v-icon>
                我的收藏
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  收藏功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '我的收藏 - 果润生活', requiresAuth: true }
    },
    {
      path: '/user/coupons',
      name: 'user-coupons',
      component: () => Promise.resolve({
        template: `
          <div class="pa-6">
            <v-card elevation="4" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold pa-6">
                <v-icon color="orange" class="mr-3">mdi-ticket-percent</v-icon>
                优惠券
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon slot="prepend">mdi-information</v-icon>
                  优惠券功能正在开发中，敬请期待！
                </v-alert>
                <v-btn color="primary" @click="$router.push('/user')">
                  <v-icon start>mdi-arrow-left</v-icon>
                  返回用户中心
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        `
      }),
      meta: { title: '优惠券 - 果润生活', requiresAuth: true }
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

// 路由守卫
router.beforeEach((to, from, next) => {
  console.group(`🛣️ 路由守卫: ${from.path} -> ${to.path}`)
  
  const isLoggedIn = AuthManager.isLoggedIn()
  console.log('🔍 当前登录状态:', isLoggedIn)
  console.log('🎯 目标路由需要认证:', to.meta.requiresAuth)
  
  // 检查token是否即将过期
  if (isLoggedIn && AuthManager.isTokenExpiringSoon()) {
    console.warn('⚠️ Token即将过期，建议重新登录')
  }
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    console.log('🔒 需要登录访问，重定向到登录页')
    console.groupEnd()
    next({ name: 'login' })
    return
  }
  
  // 如果已登录且访问登录/注册页，重定向到用户主界面
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    console.log('✅ 已登录用户，重定向到用户主界面')
    console.groupEnd()
    next({ name: 'user-dashboard' })
    return
  }
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = '果润生活'
  }
  
  console.log('✅ 路由守卫通过，继续导航')
  console.groupEnd()
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
