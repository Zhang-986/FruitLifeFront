<template>
    <div class="user-dashboard">
        <!-- 用户欢迎区域 -->
        <v-card class="welcome-card mb-6" elevation="8" rounded="xl">
            <v-card-text class="pa-8">
                <div class="d-flex align-center">
                    <v-avatar size="80" color="primary" class="mr-6">
                        <v-icon size="40" color="white">mdi-account-circle</v-icon>
                    </v-avatar>
                    <div>
                        <h2 class="text-h4 font-weight-bold mb-2">
                            欢迎回来，{{ displayName }}！🍎
                        </h2>
                        <p class="text-h6 text-medium-emphasis mb-0">
                            享受您的专属水果生活体验
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
                <v-card class="feature-card" elevation="4" rounded="xl" hover @click="navigateToFeature(feature.route)">
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

        <!-- 快速统计 -->
        <v-row class="mt-6">
            <v-col cols="12">
                <v-card elevation="4" rounded="xl">
                    <v-card-title class="text-h5 font-weight-bold pa-6">
                        <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                        我的数据概览
                    </v-card-title>
                    <v-card-text class="pa-6">
                        <v-row>
                            <v-col cols="6" md="3" class="text-center">
                                <div class="stat-item">
                                    <h3 class="text-h4 font-weight-bold text-primary">12</h3>
                                    <p class="text-body-2">订单总数</p>
                                </div>
                            </v-col>
                            <v-col cols="6" md="3" class="text-center">
                                <div class="stat-item">
                                    <h3 class="text-h4 font-weight-bold text-success">¥288</h3>
                                    <p class="text-body-2">消费总额</p>
                                </div>
                            </v-col>
                            <v-col cols="6" md="3" class="text-center">
                                <div class="stat-item">
                                    <h3 class="text-h4 font-weight-bold text-warning">5</h3>
                                    <p class="text-body-2">收藏商品</p>
                                </div>
                            </v-col>
                            <v-col cols="6" md="3" class="text-center">
                                <div class="stat-item">
                                    <h3 class="text-h4 font-weight-bold text-info">98%</h3>
                                    <p class="text-body-2">满意度</p>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 使用响应式的认证状态
const displayName = computed(() => authStore.displayName)
const isLoggedIn = computed(() => authStore.isLoggedIn)

// 功能模块
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
        description: '编辑个人信息和设置',
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
        description: '查看收藏的水果商品',
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
    authStore.logout()
    console.log('✅ 退出登录完成，跳转到登录页')
    router.push('/login')
}

// 页面加载时检查登录状态
onMounted(() => {
    if (!isLoggedIn.value) {
        console.log('🔒 未登录，重定向到登录页')
        router.push('/login')
    }
})
</script>

<style scoped>
.user-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

.welcome-card {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
}

.welcome-card .v-card-text {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
}

.feature-card {
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-item {
    padding: 16px;
    border-radius: 12px;
    background: rgba(76, 175, 80, 0.05);
}

@media (max-width: 600px) {
    .user-dashboard {
        padding: 16px;
    }

    .welcome-card .v-card-text {
        padding: 24px !important;
    }

    .welcome-card .d-flex {
        flex-direction: column;
        text-align: center;
    }

    .welcome-card .v-avatar {
        margin-bottom: 16px;
        margin-right: 0 !important;
    }
}
</style>
