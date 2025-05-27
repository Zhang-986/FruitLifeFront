<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const drawer = ref(false)
const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const navigationItems = [
  { title: '首页', icon: 'mdi-home', to: '/' },
  { title: '关于', icon: 'mdi-information', to: '/about' },
  { title: '水果商城', icon: 'mdi-fruit-cherries', to: '/shop' },
  { title: '我的订单', icon: 'mdi-cart', to: '/orders' },
  { title: '用户注册', icon: 'mdi-account-plus', to: '/register' },
  { title: '用户登录', icon: 'mdi-login', to: '/login' },
]
</script>

<template>
  <v-app :theme="theme">
    <!-- 导航抽屉 -->
    <v-navigation-drawer v-model="drawer" temporary width="320">
      <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="水果生活"
          subtitle="Fresh & Healthy" class="pa-6"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="default" nav>
        <v-list-item v-for="item in navigationItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
          :to="item.to" color="primary" class="ma-3" rounded="xl"
          style="min-height: 56px; font-size: 16px;"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 应用栏 -->
    <v-app-bar elevation="4" class="fruit-gradient" height="80">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" size="x-large"></v-app-bar-nav-icon>

      <v-app-bar-title class="text-white font-weight-bold" style="font-size: 24px;">
        <v-icon color="white" class="me-4" size="x-large">mdi-fruit-cherries</v-icon>
        水果生活
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- 搜索框 -->
      <v-text-field hide-details placeholder="搜索水果..." prepend-inner-icon="mdi-magnify" variant="outlined"
        density="comfortable" class="me-6" style="max-width: 400px; min-width: 350px; font-size: 16px;" bg-color="white"
        rounded="xl"></v-text-field>

      <!-- 主题切换按钮 -->
      <v-btn icon @click="toggleTheme" color="white" variant="text" size="x-large" class="me-3">
        <v-icon size="x-large">{{ theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>

      <!-- 购物车按钮 -->
      <v-btn icon color="white" variant="text" size="x-large">
        <v-badge content="3" color="error">
          <v-icon size="x-large">mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <!-- 主要内容区域 -->
    <v-main>
      <v-container fluid class="pa-10">
        <!-- 路由视图 -->
        <RouterView />
      </v-container>
    </v-main>

    <!-- 底部信息栏 (替代移动端底部导航) -->
    <v-footer class="bg-grey-lighten-1 text-center pa-6">
      <div class="d-flex justify-center align-center">
        <v-btn variant="text" class="mx-4">
          <v-icon start>mdi-home</v-icon>
          首页
        </v-btn>
        <v-btn variant="text" class="mx-4">
          <v-icon start>mdi-fruit-cherries</v-icon>
          商城
        </v-btn>
        <v-btn variant="text" class="mx-4">
          <v-icon start>mdi-cart</v-icon>
          购物车
        </v-btn>
        <v-btn variant="text" class="mx-4">
          <v-icon start>mdi-account</v-icon>
          我的
        </v-btn>
      </div>
      <div class="mt-4 text-body-2 opacity-70">
        © 2024 水果生活. 专注于为您提供最新鲜的水果体验
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
/* 应用栏标题样式 */
.v-app-bar-title {
  font-size: 24px !important;
  font-weight: 700 !important;
}

/* 自定义过渡动画 */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 搜索框样式 */
:deep(.v-field__input) {
  font-size: 16px !important;
}

/* 底部按钮样式 */
.v-footer .v-btn {
  font-size: 16px !important;
  min-height: 48px !important;
}
</style>
