<template>
  <v-app>
    <!-- 导航栏 -->
    <v-app-bar color="primary" density="comfortable" elevation="4" app>
      <!-- 移动端菜单按钮 -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none" color="white"></v-app-bar-nav-icon>

      <!-- Logo和标题 -->
      <v-toolbar-title class="font-weight-bold text-white">
        <router-link to="/" class="text-decoration-none text-white">
          🍎 水果生活
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- 桌面端导航菜单 -->
      <div class="d-none d-lg-flex">
        <v-btn v-for="item in menuItems" :key="item.title" :to="item.to" variant="text" color="white" class="mx-1">
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </div>

      <!-- 用户菜单 -->
      <v-menu v-if="isLoggedIn">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="white">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">{{ displayName }}</v-list-item-title>
            <v-list-item-subtitle>已登录</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item to="/user">
            <template v-slot:prepend>
              <v-icon>mdi-view-dashboard</v-icon>
            </template>
            <v-list-item-title>用户中心</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>退出登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 未登录时的菜单 -->
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="white">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/login">
            <template v-slot:prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>登录</v-list-item-title>
          </v-list-item>
          <v-list-item to="/register">
            <template v-slot:prepend>
              <v-icon>mdi-account-plus</v-icon>
            </template>
            <v-list-item-title>注册</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 移动端侧边栏 -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 主要内容区域 -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const drawer = ref(false)
const authStore = useAuthStore()

// 使用响应式的认证状态
const isLoggedIn = computed(() => authStore.isLoggedIn)
const displayName = computed(() => authStore.displayName)

// 导航菜单项
const menuItems = computed(() => {
  const baseItems = [
    { title: '首页', icon: 'mdi-home', to: '/' },
    { title: '关于我们', icon: 'mdi-information', to: '/about' }
  ]

  if (isLoggedIn.value) {
    baseItems.push({ title: '用户中心', icon: 'mdi-account-circle', to: '/user' })
  } else {
    baseItems.push(
      { title: '登录', icon: 'mdi-login', to: '/login' },
      { title: '注册', icon: 'mdi-account-plus', to: '/register' }
    )
  }

  return baseItems
})

// 退出登录
const handleLogout = () => {
  console.log('🚪 用户点击退出登录')
  authStore.logout()
  console.log('✅ 退出登录完成，跳转到首页')
  router.push('/')
}

// 页面加载时检查登录状态
onMounted(() => {
  // 如果当前在需要登录的页面但未登录，跳转到登录页
  if (router.currentRoute.value.meta.requiresAuth && !isLoggedIn.value) {
    router.push('/login')
  }
})
</script>

<style scoped>
/* 确保导航栏文字和图标颜色为白色 */
.v-app-bar .v-toolbar-title a {
  color: white !important;
  text-decoration: none !important;
}

.v-app-bar .v-btn {
  color: white !important;
}

.v-app-bar .v-icon {
  color: white !important;
}

/* 悬停效果 */
.v-app-bar .v-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
