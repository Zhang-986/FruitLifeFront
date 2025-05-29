<template>
  <v-app>
    <!-- 应用内容 -->
    <router-view />

    <!-- 全局样式和主题 -->
    <div class="fruit-life-app">
      <!-- 主要内容区域 -->
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 应用初始化
onMounted(() => {
  console.log('🍎 水果生活应用初始化')

  // 初始化认证状态
  authStore.initializeAuth()

  console.log('✅ 应用初始化完成')
})
</script>

<style scoped>
.fruit-life-app {
  min-height: 100vh;
}

/* 全局水果主题样式 */
:deep(.fruit-gradient) {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

:deep(.fruit-card) {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

:deep(.fruit-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
