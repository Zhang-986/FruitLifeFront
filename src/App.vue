<template>
  <v-app>
    <!-- 主要内容区域 -->
    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// 移除所有导航相关的代码，现在由各个页面自己决定是否显示导航栏
</script>

<style scoped>
.app-main {
  padding-top: 0 !important;
}
</style>
