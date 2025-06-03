<template>
    <div class="points-center">
        <AppNavigation />

        <div class="points-content">
            <v-container class="py-8">
                <!-- 积分概览卡片 -->
                <v-card class="points-overview-card mb-6" elevation="12" rounded="xl">
                    <div class="points-header fruit-gradient">
                        <v-card-title class="text-white d-flex align-center pa-6">
                            <v-icon color="white" class="mr-3" size="large">mdi-star-circle</v-icon>
                            <span class="text-h4 font-weight-bold">我的积分</span>
                        </v-card-title>
                    </div>

                    <v-card-text class="pa-6">
                        <v-row>
                            <!-- 当前积分 -->
                            <v-col cols="12" md="4">
                                <div class="points-stat-card current-points">
                                    <div class="stat-icon">💰</div>
                                    <div class="stat-value">{{ userPoints.current.toLocaleString() }}</div>
                                    <div class="stat-label">当前积分</div>
                                </div>
                            </v-col>

                            <!-- 累计获得 -->
                            <v-col cols="12" md="4">
                                <div class="points-stat-card total-earned">
                                    <div class="stat-icon">📈</div>
                                    <div class="stat-value">{{ userPoints.totalEarned.toLocaleString() }}</div>
                                    <div class="stat-label">累计获得</div>
                                </div>
                            </v-col>

                            <!-- 累计消费 -->
                            <v-col cols="12" md="4">
                                <div class="points-stat-card total-spent">
                                    <div class="stat-icon">🛒</div>
                                    <div class="stat-value">{{ userPoints.totalSpent.toLocaleString() }}</div>
                                    <div class="stat-label">累计消费</div>
                                </div>
                            </v-col>
                        </v-row>

                        <!-- 等级信息 -->
                        <v-card class="level-card mt-4" variant="tonal" color="primary" rounded="xl">
                            <v-card-text class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center">
                                        <v-avatar color="primary" class="mr-3" size="48">
                                            <v-icon color="white" size="24">{{ userLevel.icon }}</v-icon>
                                        </v-avatar>
                                        <div>
                                            <h3 class="level-name">{{ userLevel.name }}</h3>
                                            <p class="level-description mb-0">{{ userLevel.description }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="level-progress-text">距离下一等级</div>
                                        <div class="points-needed">{{ userLevel.pointsToNext }}积分</div>
                                    </div>
                                </div>

                                <!-- 等级进度条 -->
                                <v-progress-linear :model-value="userLevel.progress" color="primary" height="8" rounded
                                    class="mt-3"></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>

                <!-- 功能标签页 -->
                <v-card class="tabs-card" elevation="8" rounded="xl">
                    <v-tabs v-model="activeTab" color="primary" class="pa-2">
                        <v-tab value="earn">
                            <v-icon start>mdi-plus-circle</v-icon>
                            赚取积分
                        </v-tab>
                        <v-tab value="spend">
                            <v-icon start>mdi-shopping</v-icon>
                            积分商城
                        </v-tab>
                        <v-tab value="history">
                            <v-icon start>mdi-history</v-icon>
                            积分明细
                        </v-tab>
                        <v-tab value="rules">
                            <v-icon start>mdi-information</v-icon>
                            积分规则
                        </v-tab>
                    </v-tabs>

                    <v-divider></v-divider>

                    <v-card-text class="pa-6">
                        <v-tabs-window v-model="activeTab">
                            <!-- 赚取积分 -->
                            <v-tabs-window-item value="earn">
                                <div class="earn-points-section">
                                    <h3 class="section-title mb-4">赚取积分的方式</h3>

                                    <v-row>
                                        <v-col v-for="task in dailyTasks" :key="task.id" cols="12" md="6">
                                            <v-card class="task-card" variant="outlined" rounded="lg"
                                                :class="{ 'completed': task.completed }">
                                                <v-card-text class="pa-4">
                                                    <div class="d-flex align-center justify-space-between">
                                                        <div class="d-flex align-center">
                                                            <div class="task-icon">{{ task.icon }}</div>
                                                            <div class="ml-3">
                                                                <h4 class="task-title">{{ task.title }}</h4>
                                                                <p class="task-description mb-0">{{ task.description }}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="task-reward">+{{ task.points }}积分</div>
                                                            <v-btn :color="task.completed ? 'success' : 'primary'"
                                                                :variant="task.completed ? 'tonal' : 'flat'"
                                                                size="small" :disabled="task.completed"
                                                                @click="completeTask(task)" class="mt-1">
                                                                {{ task.completed ? '已完成' : '去完成' }}
                                                            </v-btn>
                                                        </div>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-tabs-window-item>

                            <!-- 积分商城 -->
                            <v-tabs-window-item value="spend">
                                <div class="points-shop-section">
                                    <h3 class="section-title mb-4">积分商城</h3>

                                    <v-row>
                                        <v-col v-for="item in shopItems" :key="item.id" cols="12" sm="6" md="4">
                                            <v-card class="shop-item-card" elevation="4" rounded="xl" hover>
                                                <v-img :src="item.image" :alt="item.name" height="150" cover>
                                                    <div class="shop-item-overlay">
                                                        <v-chip color="error" variant="elevated" class="price-chip">
                                                            {{ item.price }}积分
                                                        </v-chip>
                                                    </div>
                                                </v-img>

                                                <v-card-text class="pa-4">
                                                    <h4 class="shop-item-title">{{ item.name }}</h4>
                                                    <p class="shop-item-description">{{ item.description }}</p>

                                                    <v-btn color="primary" variant="flat" block
                                                        :disabled="userPoints.current < item.price"
                                                        @click="exchangeItem(item)" class="mt-2">
                                                        <v-icon start>mdi-cart</v-icon>
                                                        {{ userPoints.current >= item.price ? '立即兑换' : '积分不足' }}
                                                    </v-btn>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-tabs-window-item>

                            <!-- 积分明细 -->
                            <v-tabs-window-item value="history">
                                <div class="points-history-section">
                                    <div class="d-flex align-center justify-space-between mb-4">
                                        <h3 class="section-title">积分明细</h3>
                                        <v-select v-model="historyFilter" :items="historyFilterOptions"
                                            variant="outlined" density="compact" hide-details
                                            class="filter-select"></v-select>
                                    </div>

                                    <v-card variant="outlined" rounded="lg">
                                        <v-data-table :headers="historyHeaders" :items="filteredHistory"
                                            :loading="loadingHistory" class="points-history-table"
                                            no-data-text="暂无积分记录">
                                            <template v-slot:item.type="{ item }">
                                                <v-chip :color="getTypeColor(item.type)" variant="tonal" size="small">
                                                    {{ getTypeText(item.type) }}
                                                </v-chip>
                                            </template>

                                            <template v-slot:item.amount="{ item }">
                                                <span :class="item.amount > 0 ? 'text-success' : 'text-error'">
                                                    {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
                                                </span>
                                            </template>

                                            <template v-slot:item.createdAt="{ item }">
                                                {{ formatDate(item.createdAt) }}
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </div>
                            </v-tabs-window-item>

                            <!-- 积分规则 -->
                            <v-tabs-window-item value="rules">
                                <div class="points-rules-section">
                                    <h3 class="section-title mb-4">积分规则说明</h3>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-card class="rules-card" variant="tonal" color="success" rounded="lg">
                                                <v-card-title class="d-flex align-center">
                                                    <v-icon color="success" class="mr-2">mdi-plus-circle</v-icon>
                                                    获取积分
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-list density="compact">
                                                        <v-list-item v-for="rule in earnRules" :key="rule.action">
                                                            <template v-slot:prepend>
                                                                <v-icon color="success" size="small">mdi-check</v-icon>
                                                            </template>
                                                            <v-list-item-title>{{ rule.action }}</v-list-item-title>
                                                            <template v-slot:append>
                                                                <v-chip color="success" size="small" variant="flat">
                                                                    +{{ rule.points }}
                                                                </v-chip>
                                                            </template>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-card class="rules-card" variant="tonal" color="info" rounded="lg">
                                                <v-card-title class="d-flex align-center">
                                                    <v-icon color="info" class="mr-2">mdi-information</v-icon>
                                                    积分说明
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-list density="compact">
                                                        <v-list-item v-for="note in pointsNotes" :key="note">
                                                            <template v-slot:prepend>
                                                                <v-icon color="info"
                                                                    size="small">mdi-circle-small</v-icon>
                                                            </template>
                                                            <v-list-item-title>{{ note }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </v-container>
        </div>

        <!-- 提示信息 -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'

// 响应式数据
const activeTab = ref('earn')
const loadingHistory = ref(false)
const historyFilter = ref('all')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 用户积分信息
const userPoints = ref({
    current: 1250,
    totalEarned: 3450,
    totalSpent: 2200
})

// 用户等级信息
const userLevel = ref({
    name: '健康达人',
    icon: 'mdi-star',
    description: '继续努力，向健康专家迈进',
    progress: 65,
    pointsToNext: 750
})

// 每日任务
const dailyTasks = ref([
    {
        id: 1,
        title: '每日签到',
        description: '连续签到获得额外奖励',
        icon: '📅',
        points: 10,
        completed: true
    },
    {
        id: 2,
        title: '浏览水果',
        description: '浏览5种不同的水果',
        icon: '🔍',
        points: 15,
        completed: false
    },
    {
        id: 3,
        title: '分享推荐',
        description: '分享一个水果推荐',
        icon: '📤',
        points: 20,
        completed: false
    },
    {
        id: 4,
        title: '完善资料',
        description: '完善个人健康资料',
        icon: '📝',
        points: 30,
        completed: false
    }
])

// 积分商城商品
const shopItems = ref([
    {
        id: 1,
        name: '优惠券',
        description: '全场8折优惠券',
        price: 200,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
    },
    {
        id: 2,
        name: '免费配送',
        description: '免费配送券一张',
        price: 150,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
    },
    {
        id: 3,
        name: '精美水果盒',
        description: '限量版精美水果包装盒',
        price: 500,
        image: 'https://images.unsplash.com/photo-1542838686-2e449f4b5a5d?w=300&h=200&fit=crop'
    }
])

// 积分历史记录
const pointsHistory = ref([
    {
        id: 1,
        type: 'earn',
        amount: 10,
        description: '每日签到',
        createdAt: new Date('2024-01-15')
    },
    {
        id: 2,
        type: 'spend',
        amount: -200,
        description: '兑换优惠券',
        createdAt: new Date('2024-01-14')
    },
    {
        id: 3,
        type: 'earn',
        amount: 50,
        description: '购买水果',
        createdAt: new Date('2024-01-13')
    }
])

// 获取积分规则
const earnRules = ref([
    { action: '每日签到', points: 10 },
    { action: '购买商品', points: '订单金额1%' },
    { action: '评价商品', points: 5 },
    { action: '分享推荐', points: 20 },
    { action: '完善资料', points: 30 },
    { action: '邀请好友', points: 100 }
])

// 积分说明
const pointsNotes = ref([
    '积分有效期为12个月',
    '积分不可转让给他人',
    '特殊活动期间可获得双倍积分',
    '兑换商品后积分立即扣除',
    '系统故障导致的积分异常会及时补偿'
])

// 表格配置
const historyHeaders = [
    { title: '类型', key: 'type', sortable: false },
    { title: '积分变动', key: 'amount', sortable: true },
    { title: '说明', key: 'description', sortable: false },
    { title: '时间', key: 'createdAt', sortable: true }
]

const historyFilterOptions = [
    { title: '全部', value: 'all' },
    { title: '获得积分', value: 'earn' },
    { title: '消费积分', value: 'spend' }
]

// 计算属性
const filteredHistory = computed(() => {
    if (historyFilter.value === 'all') {
        return pointsHistory.value
    }
    return pointsHistory.value.filter(item => item.type === historyFilter.value)
})

// 方法
const completeTask = (task: any) => {
    // TODO: 调用API完成任务
    task.completed = true
    userPoints.value.current += task.points
    showMessage(`完成任务获得${task.points}积分！`, 'success')
}

const exchangeItem = (item: any) => {
    if (userPoints.value.current >= item.price) {
        // TODO: 调用API兑换商品
        userPoints.value.current -= item.price
        userPoints.value.totalSpent += item.price
        showMessage(`成功兑换${item.name}！`, 'success')
    } else {
        showMessage('积分不足，无法兑换', 'error')
    }
}

const getTypeColor = (type: string) => {
    return type === 'earn' ? 'success' : 'error'
}

const getTypeText = (type: string) => {
    return type === 'earn' ? '获得' : '消费'
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 生命周期
onMounted(() => {
    // TODO: 加载用户积分数据
    console.log('加载积分中心数据')
})
</script>

<style scoped>
.points-center {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.points-content {
    margin-top: 64px;
    min-height: calc(100vh - 64px);
}

.points-overview-card {
    background: rgba(255, 255, 255, 0.98) !important;
}

.points-header {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    border-radius: 24px 24px 0 0;
}

.fruit-gradient {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.points-stat-card {
    text-align: center;
    padding: 24px 16px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%);
    border: 2px solid rgba(76, 175, 80, 0.1);
    transition: all 0.3s ease;
}

.points-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(76, 175, 80, 0.3);
}

.stat-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2E7D32;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
}

.level-card {
    background: rgba(76, 175, 80, 0.05) !important;
}

.level-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2E7D32;
    margin-bottom: 4px;
}

.level-description {
    color: #666;
    font-size: 0.9rem;
}

.level-progress-text {
    font-size: 0.8rem;
    color: #666;
}

.points-needed {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2E7D32;
}

.tabs-card {
    background: rgba(255, 255, 255, 0.98) !important;
}

.section-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.task-card {
    transition: all 0.3s ease;
    height: 100%;
}

.task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-card.completed {
    background: rgba(76, 175, 80, 0.05) !important;
    border-color: rgba(76, 175, 80, 0.3) !important;
}

.task-icon {
    font-size: 1.8rem;
}

.task-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.task-description {
    font-size: 0.85rem;
    color: #666;
}

.task-reward {
    font-size: 1rem;
    font-weight: 600;
    color: #FF6B35;
}

.shop-item-card {
    transition: all 0.3s ease;
    height: 100%;
}

.shop-item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.shop-item-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
}

.price-chip {
    font-weight: 600;
}

.shop-item-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.shop-item-description {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0;
}

.filter-select {
    max-width: 200px;
}

.points-history-table {
    background: transparent !important;
}

.rules-card {
    height: 100%;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .points-content {
        margin-top: 56px;
        min-height: calc(100vh - 56px);
    }

    .stat-value {
        font-size: 1.5rem;
    }

    .stat-icon {
        font-size: 2rem;
    }

    .task-icon {
        font-size: 1.5rem;
    }
}
</style>
