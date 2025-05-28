<template>
    <div class="user-dashboard-page">
        <!-- 使用统一的导航组件 -->
        <AppNavigation :show-search-button="true" :show-cart-button="true" />

        <!-- 用户中心内容 -->
        <div class="user-dashboard">
            <!-- 用户欢迎区域 -->
            <v-card class="welcome-card mb-6" elevation="8" rounded="xl">
                <v-card-text class="pa-8">
                    <div class="d-flex align-center">
                        <div>
                            <p class="text-h6 text-medium-emphasis mb-0">
                                欢迎回来，{{ displayName }}
                            </p>
                            <v-chip color="success" size="small" prepend-icon="mdi-check-circle" class="mt-2">
                                已登录
                            </v-chip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="outlined" prepend-icon="mdi-logout" @click="handleLogout">
                            退出登录
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>

            <!-- 功能导航卡片 -->
            <v-row>
                <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="4">
                    <v-card class="feature-card" elevation="4" rounded="xl" hover
                        @click="navigateToFeature(feature.route)">
                        <v-card-text class="text-center pa-6">
                            <div class="feature-icon mb-4">
                                <v-icon :color="feature.color" size="48">{{ feature.icon }}</v-icon>
                            </div>
                            <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
                            <p class="text-body-2 text-medium-emphasis">{{ feature.description }}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthManager } from '@/utils/auth-manager'
import { useAuthStore } from '@/stores/auth'
import AppNavigation from '@/components/AppNavigation.vue'

const router = useRouter()
const authStore = useAuthStore()

// 计算用户显示名称
const displayName = computed(() => {
    return AuthManager.getDisplayName()
})

// 功能卡片数据
const features = ref([
    {
        title: '我的订单',
        description: '查看和管理您的订单',
        icon: 'mdi-package-variant',
        color: 'primary',
        route: '/user/orders'
    },
    {
        title: '购物车',
        description: '管理您的购物车商品',
        icon: 'mdi-cart',
        color: 'success',
        route: '/user/cart'
    },
    {
        title: '个人资料',
        description: '编辑个人信息和偏好',
        icon: 'mdi-account-edit',
        color: 'info',
        route: '/user/profile'
    },
    {
        title: '收货地址',
        description: '管理您的收货地址',
        icon: 'mdi-map-marker',
        color: 'warning',
        route: '/user/addresses'
    },
    {
        title: '我的收藏',
        description: '查看收藏的商品',
        icon: 'mdi-heart',
        color: 'pink',
        route: '/user/favorites'
    },
    {
        title: '优惠券',
        description: '查看和使用优惠券',
        icon: 'mdi-ticket-percent',
        color: 'orange',
        route: '/user/coupons'
    }
])

// 导航到功能页面
const navigateToFeature = (route: string) => {
    router.push(route)
}

// 退出登录
const handleLogout = () => {
    console.log('🚪 用户点击退出登录')

    // 清除认证信息
    AuthManager.logout()

    // 跳转到登录页
    router.replace('/login')
}

// 页面加载时检查登录状态
onMounted(() => {
    console.log('🔍 UserDashboard加载，检查登录状态')

    if (!AuthManager.isLoggedIn()) {
        console.log('❌ 未登录，重定向到登录页')
        router.replace('/login')
        return
    }

    console.log('✅ 已登录，显示用户界面')
    AuthManager.debugStorage()
})
</script>

<style scoped>
.user-dashboard-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    padding: 20px;
}

.user-dashboard {
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
}

.feature-card {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    cursor: pointer;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (max-width: 600px) {
    .user-dashboard-page {
        padding: 16px;
    }
}
</style>
