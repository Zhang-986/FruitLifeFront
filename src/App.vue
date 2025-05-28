<template>
  <v-app>
    <!-- 主要内容区域 -->
    <v-main class="app-main">
      <router-view />
    </v-main>

    <!-- 全局用户信息通知组件 -->
    <UserInfoNotification />
  </v-app>
</template>

<script setup lang="ts">
// 移除自动初始化WebSocket的逻辑，只在登录成功后才启动
import UserInfoNotification from '@/components/UserInfoNotification.vue'
</script>

<style scoped>
.app-main {
  padding-top: 0 !important;
}
</style>
