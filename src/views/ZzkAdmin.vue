<template>
    <div class="admin-panel">
        <!-- 使用统一导航 -->
        <AppNavigation />

        <!-- 主要内容区域 -->
        <div class="admin-content">
            <v-container fluid class="pa-6">




                <!-- 管理模块入口 -->
                <div class="management-modules">
                    <h2 class="section-title mb-6">
                        <v-icon color="deep-purple" class="mr-3">mdi-view-dashboard</v-icon>
                        管理模块
                    </h2>

                    <v-row>
                        <!-- 水果管理模块 -->
                        <v-col cols="12" md="6">
                            <v-card class="module-card fruit-module" elevation="6" rounded="xl"
                                @click="goToFruitManagement" hover>
                                <div class="module-header fruit-gradient">
                                    <v-card-title class="text-white d-flex align-center pa-6">
                                        <div class="module-icon mr-4">🍎</div>
                                        <div>
                                            <h3 class="text-h5 font-weight-bold">水果管理系统</h3>
                                            <p class="text-subtitle-1 opacity-90 mb-0">管理水果信息、分类和库存</p>
                                        </div>
                                    </v-card-title>
                                </div>

                                <v-card-text class="pa-6">
                                    <div class="module-stats mb-4">
                                        <v-row>
                                            <v-col cols="6">
                                                <div class="text-center">
                                                    <div class="text-h6 font-weight-bold text-primary">{{
                                                        adminStats.fruitCount }}</div>
                                                    <div class="text-caption">水果种类</div>
                                                </div>
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-center">
                                                    <div class="text-h6 font-weight-bold text-success">23</div>
                                                    <div class="text-caption">分类数量</div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <v-list density="compact">
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="primary" size="small">mdi-plus</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">添加和编辑水果信息</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="primary" size="small">mdi-view-list</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">查看和管理水果列表</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="primary" size="small">mdi-image-multiple</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">批量图片管理</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>

                                <v-card-actions class="pa-6 pt-0">
                                    <v-btn color="primary" variant="elevated" block size="large"
                                        class="font-weight-bold" @click="goToFruitManagement">
                                        <v-icon start>mdi-fruit-cherries</v-icon>
                                        进入水果管理
                                        <v-icon end>mdi-arrow-right</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>

                        <!-- 任务管理模块 -->
                        <v-col cols="12" md="6">
                            <v-card class="module-card task-module" elevation="6" rounded="xl"
                                @click="goToTaskManagement" hover>
                                <div class="module-header task-gradient">
                                    <v-card-title class="text-white d-flex align-center pa-6">
                                        <div class="module-icon mr-4">📋</div>
                                        <div>
                                            <h3 class="text-h5 font-weight-bold">任务管理系统</h3>
                                            <p class="text-subtitle-1 opacity-90 mb-0">管理系统任务和用户活动</p>
                                        </div>
                                    </v-card-title>
                                </div>

                                <v-card-text class="pa-6">
                                    <div class="module-stats mb-4">
                                        <v-row>
                                            <v-col cols="6">
                                                <div class="text-center">
                                                    <div class="text-h6 font-weight-bold text-orange">{{
                                                        taskStats.totalTasks }}</div>
                                                    <div class="text-caption">总任务</div>
                                                </div>
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-center">
                                                    <div class="text-h6 font-weight-bold text-success">{{
                                                        taskStats.activeTasks }}</div>
                                                    <div class="text-caption">活跃任务</div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <v-list density="compact">
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="orange" size="small">mdi-plus</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">创建和分配任务</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="orange" size="small">mdi-chart-timeline</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">任务进度跟踪</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon color="orange" size="small">mdi-account-check</v-icon>
                                            </template>
                                            <v-list-item-title class="text-body-2">用户活动监控</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>

                                <v-card-actions class="pa-6 pt-0">
                                    <v-btn color="orange" variant="elevated" block size="large" class="font-weight-bold"
                                        @click="goToTaskManagement">
                                        <v-icon start>mdi-clipboard-list</v-icon>
                                        进入任务管理
                                        <v-icon end>mdi-arrow-right</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </v-container>

        </div>
        <!-- 统计概览 -->
        <div class="stats-overview mb-8">
            <v-row>
                <v-col cols="12" sm="6" md="3">
                    <v-card class="stat-card" elevation="4" rounded="xl" color="primary">
                        <v-card-text class="pa-6 text-center text-white">
                            <v-icon size="48" class="mb-3">mdi-fruit-cherries</v-icon>
                            <div class="text-h4 font-weight-bold">{{ adminStats.fruitCount }}</div>
                            <div class="text-subtitle-1">水果种类</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card class="stat-card" elevation="4" rounded="xl" color="success">
                        <v-card-text class="pa-6 text-center text-white">
                            <v-icon size="48" class="mb-3">mdi-account-group</v-icon>
                            <div class="text-h4 font-weight-bold">{{ adminStats.userCount }}</div>
                            <div class="text-subtitle-1">注册用户</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card class="stat-card" elevation="4" rounded="xl" color="warning">
                        <v-card-text class="pa-6 text-center text-white">
                            <v-icon size="48" class="mb-3">mdi-clipboard-list</v-icon>
                            <div class="text-h4 font-weight-bold">{{ taskStats.totalTasks }}</div>
                            <div class="text-subtitle-1">任务总数</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card class="stat-card" elevation="4" rounded="xl" color="info">
                        <v-card-text class="pa-6 text-center text-white">
                            <v-icon size="48" class="mb-3">mdi-chart-line</v-icon>
                            <div class="text-h4 font-weight-bold">{{ formatSales }}</div>
                            <div class="text-subtitle-1">今日销售额</div>
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
import { useAuthStore } from '@/stores/auth'
import { getAdminStats, type AdminStats } from '@/utils/admin-api'
import AppNavigation from '@/components/AppNavigation.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const adminStats = ref<AdminStats>({
    fruitCount: 0,
    userCount: 0,
    pendingOrders: 0,
    todaySales: 0
})

// 任务统计数据（模拟）
const taskStats = ref({
    totalTasks: 45,
    activeTasks: 23,
    completedTasks: 22
})

// 快速操作列表
const quickActions = ref([
    { title: '添加水果', icon: 'mdi-plus', color: 'primary', action: 'add-fruit' },
    { title: '用户管理', icon: 'mdi-account-group', color: 'success', action: 'user-management' },
    { title: '系统设置', icon: 'mdi-cog', color: 'info', action: 'system-settings' },
    { title: '数据报表', icon: 'mdi-chart-bar', color: 'purple', action: 'reports' },
    { title: '备份数据', icon: 'mdi-database-export', color: 'orange', action: 'backup' },
    { title: '系统日志', icon: 'mdi-text-box-search', color: 'grey', action: 'logs' }
])

// 计算属性
const formatSales = computed(() => {
    const sales = adminStats.value.todaySales
    if (sales >= 10000) {
        return `¥${(sales / 1000).toFixed(1)}k`
    }
    return `¥${sales}`
})

// 方法
const goToFruitManagement = () => {
    console.log('Navigating to Fruit Management page')
    // 确保这里使用的是在 router/index.ts 中定义的 name 或 path
    router.push({ name: 'FruitManagement' })
    // 或者使用路径: router.push('/fruit-management')
}

const goToTaskManagement = () => {
    router.push('/task-management')
}

const goToUserManagement = () => {
    console.log('🚀 跳转到用户管理')
    // router.push('/user-management') // 等用户管理页面完成后启用
}

// 加载管理员统计数据
const loadAdminStats = async () => {
    try {
        const response = await getAdminStats()
        if (response.code === 200) {
            adminStats.value = response.data
        }
    } catch (error) {
        console.error('加载管理员统计数据失败:', error)
        // 使用默认数据
        adminStats.value = {
            fruitCount: 23,
            userCount: 156,
            pendingOrders: 89,
            todaySales: 12500
        }
    }
}

onMounted(async () => {
    // 检查管理员权限
    if (!authStore.isAdmin) {
        router.replace('/user')
        return
    }

    await loadAdminStats()
})
</script>

<style scoped>
.admin-panel {
    min-height: 100vh;
    background: #f5f5f5;
}

.admin-content {
    margin-top: 64px;
}

.admin-icon {
    font-size: 4rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.stat-card {
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.module-card {
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
}

.module-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15) !important;
    border-color: rgba(76, 175, 80, 0.3);
}

.module-icon {
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.fruit-gradient {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.task-gradient {
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.quick-action-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.quick-action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .admin-content {
        margin-top: 56px;
    }

    .module-card .module-icon {
        font-size: 2.5rem;
    }
}
</style>
