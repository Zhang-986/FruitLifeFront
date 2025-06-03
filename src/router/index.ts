import { createRouter, createWebHistory } from 'vue-router'
// import { AuthManager } from '@/utils/auth-manager' // AuthManager might not be needed if using store directly
import { createRetryableImport } from '@/utils/route-helper'
import { useAuthStore } from '@/stores/auth'

// 使用动态导入和重试机制
const routes = [
  {
    path: '/',
    name: 'home',
    component: createRetryableImport('../views/HomeView.vue'),
    meta: { title: '首页 - 果润生活', requiresAuth: false }
  },
  {
    path: '/products',
    name: 'products',
    component: createRetryableImport('../views/ProductsView.vue'),
    meta: { title: '水果列表 - 果润生活', requiresAuth: false }
  },
  {
    path: '/about',
    name: 'about',
    component: createRetryableImport('../views/AboutView.vue'),
    meta: { title: '关于我们 - 果润生活', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: createRetryableImport('../views/RegisterView.vue'),
    meta: { title: '用户注册 - 果润生活', requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: createRetryableImport('../views/LoginView.vue'),
    meta: { title: '用户登录 - 果润生活', requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: createRetryableImport('../views/ForgotPasswordView.vue'),
    meta: { title: '找回密码 - 果润生活', requiresAuth: false }
  },
  // 用户专属区域
  {
    path: '/user',
    name: 'user-dashboard',
    component: createRetryableImport('../views/UserDashboard.vue'),
    meta: { title: '用户中心 - 果润生活', requiresAuth: true }
  },
  {
    path: '/user/profile-wizard',
    name: 'profile-wizard',
    component: createRetryableImport('../views/ProfileWizardView.vue'),
    meta: { title: '资料完善向导 - 果润生活', requiresAuth: true }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: createRetryableImport('../views/UserProfile.vue'),
    meta: { title: '个人资料 - 果润生活', requiresAuth: true }
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
  {
    path: '/user/points',
    name: 'PointsCenter',
    component: () => import('@/views/PointsCenter.vue'),
    meta: { requiresAuth: true }
  },
  // 新增：水果管理页面（zzk路由）
  {
    path: '/zzk',
    name: 'ZzkAdmin',
    component: () => import('@/views/ZzkAdmin.vue'),
    meta: {
      requiresAuth: true,
      title: '管理员控制面板'
    }
  },
  // 新增：水果管理页面
  {
    path: '/fruit-management', // 确保路径是这个
    name: 'FruitManagement',   // 确保名称是这个
    component: () => import('@/views/FruitManagement.vue'), // 确保组件路径正确
    // 如果使用了 createRetryableImport，请确保其配置正确
    // component: createRetryableImport('../views/FruitManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '水果管理系统'
    }
  },
  {
    path: '/task-management',
    name: 'TaskManagement',
    component: () => import('@/views/TaskManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: '任务管理'
    }
  },
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.group(`🛣️ 路由守卫: ${from.path} -> ${to.path}`);
  const authStore = useAuthStore();
  
  // 确保认证状态和管理员权限已初始化检查完毕
  await authStore.initializeAuth();

  const isLoggedIn = authStore.isLoggedIn; // Use direct store access
  const isAdmin = authStore.isAdmin;

  console.log('🔍 当前登录状态:', isLoggedIn);
  console.log('👑 当前管理员状态:', isAdmin, '(已检查:', authStore.adminStatusChecked, ')');
  console.log('🎯 目标路由元信息:', to.meta);
  
  // 检查token是否即将过期
  if (isLoggedIn && authStore.isTokenExpiringSoon()) { // Use authStore directly
    console.warn('⚠️ Token即将过期，建议重新登录')
  }
  
  // Handle redirection for logged-in users trying to access login/register
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    console.log('✅ 已登录用户访问登录/注册页，重定向到用户主界面');
    console.groupEnd();
    next({ name: 'user-dashboard' });
    return;
  }

  const requiresAuth = to.meta.requiresAuth as boolean | undefined;
  const requiresAdmin = to.meta.requiresAdmin as boolean | undefined;

  // Handle routes requiring admin privileges
  if (requiresAdmin) {
    if (!isLoggedIn) {
      console.log('🔒 管理员路由: 用户未登录，重定向到登录页');
      console.groupEnd();
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
    if (!isAdmin) {
      console.log('🚫 管理员路由: 用户非管理员，重定向到首页');
      console.groupEnd();
      next({ name: 'home' }); // Or a dedicated 'Unauthorized' page
      return;
    }
    console.log('🔑 管理员路由: 权限通过');
  }
  // Handle routes requiring authentication (but not necessarily admin)
  else if (requiresAuth) {
    if (!isLoggedIn) {
      console.log('🔒 普通认证路由: 用户未登录，重定向到登录页');
      console.groupEnd();
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
    console.log('🔑 普通认证路由: 权限通过');
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
