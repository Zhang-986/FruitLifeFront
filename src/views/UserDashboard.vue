<template>
    <div class="user-dashboard">
        <!-- 使用统一的导航组件 -->
        <AppNavigation />

        <!-- 主要内容区域 -->
        <div class="dashboard-content">
            <v-container fluid class="pa-6">
                <!-- 用户信息卡片 -->
                <v-row class="mb-6">
                    <v-col cols="12">
                        <v-card class="user-info-card fruit-card" elevation="8" rounded="xl">
                            <div class="user-info-header fruit-gradient">
                                <div class="user-info-content">
                                    <!-- 用户头像 - 可编辑 -->
                                    <div class="avatar-section">
                                        <div class="avatar-wrapper" @click="handleAvatarEdit">
                                            <UserAvatar :user="getUserAvatarInfo()" :size="80" editable
                                                class="user-dashboard-avatar" @edit="handleAvatarEdit" />
                                            <div class="avatar-edit-hint">
                                                <v-icon size="small" color="white">mdi-camera</v-icon>
                                                <span class="text-caption text-white ml-1">点击编辑</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 用户基本信息 -->
                                    <div class="user-basic-info">
                                        <h2 class="user-name text-white">{{ displayName }}</h2>
                                        <p class="user-email text-white opacity-90">{{ userEmail }}</p>
                                        <div class="d-flex align-center gap-2 mt-2">
                                            <v-chip :color="userCompletionStatus.color" variant="elevated" size="small">
                                                <v-icon start size="small">{{ userCompletionStatus.icon }}</v-icon>
                                                {{ userCompletionStatus.text }}
                                            </v-chip>
                                            <!-- 管理员徽章和入口 -->
                                            <v-chip v-if="authStore.isAdmin" color="deep-purple" variant="elevated"
                                                size="small" @click="goToAdminPanel" class="admin-entry-chip">
                                                <v-icon start size="small">mdi-crown</v-icon>
                                                管理员
                                            </v-chip>
                                        </div>
                                    </div>
                                    <!-- 管理员快速入口按钮 -->
                                    <div v-if="authStore.isAdmin" class="admin-quick-entry">
                                        <v-btn color="deep-purple" variant="elevated" size="large"
                                            @click="goToAdminPanel" class="admin-dashboard-btn">
                                            <v-icon start>mdi-cog</v-icon>
                                            管理后台
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- 管理员专属统计卡片 -->
                <v-row v-if="authStore.isAdmin" class="mb-6">
                    <v-col cols="12">
                        <v-card class="admin-stats-card fruit-card" elevation="4" rounded="xl">
                            <v-card-title class="d-flex align-center">
                                <v-icon color="deep-purple" class="mr-2">mdi-shield-crown</v-icon>
                                <span class="text-deep-purple font-weight-bold">管理员面板</span>
                                <v-spacer></v-spacer>
                                <v-chip color="deep-purple" size="small" variant="flat">
                                    管理员权限
                                </v-chip>
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <v-row>
                                    <v-col cols="6" sm="3">
                                        <div class="admin-stat-item text-center">
                                            <v-icon size="36" color="primary" class="mb-2">mdi-fruit-cherries</v-icon>
                                            <div class="text-h6 font-weight-bold">23</div>
                                            <div class="text-caption text-medium-emphasis">水果种类</div>
                                        </div>
                                    </v-col>
                                    <v-col cols="6" sm="3">
                                        <div class="admin-stat-item text-center">
                                            <v-icon size="36" color="success" class="mb-2">mdi-account-group</v-icon>
                                            <div class="text-h6 font-weight-bold">156</div>
                                            <div class="text-caption text-medium-emphasis">注册用户</div>
                                        </div>
                                    </v-col>
                                    <v-col cols="6" sm="3">
                                        <div class="admin-stat-item text-center">
                                            <v-icon size="36" color="warning" class="mb-2">mdi-package-variant</v-icon>
                                            <div class="text-h6 font-weight-bold">89</div>
                                            <div class="text-caption text-medium-emphasis">待处理订单</div>
                                        </div>
                                    </v-col>
                                    <v-col cols="6" sm="3">
                                        <div class="admin-stat-item text-center">
                                            <v-icon size="36" color="info" class="mb-2">mdi-chart-line</v-icon>
                                            <div class="text-h6 font-weight-bold">¥12.5k</div>
                                            <div class="text-caption text-medium-emphasis">今日销售额</div>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-divider class="my-4"></v-divider>
                                <div class="d-flex justify-center">
                                    <v-btn color="deep-purple" variant="elevated" size="large" @click="goToAdminPanel"
                                        class="admin-main-btn">
                                        <v-icon start>mdi-fruit-cherries</v-icon>
                                        进入水果管理系统
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- 统计卡片 -->
                <v-row class="mb-6">
                    <v-col cols="12" sm="6" md="3">
                        <v-card class="stat-card fruit-card" elevation="4" rounded="xl">
                            <v-card-text class="pa-6 text-center">
                                <v-icon size="48" color="primary" class="mb-3">mdi-package-variant</v-icon>
                                <div class="text-h4 font-weight-bold text-primary">8</div>
                                <div class="text-subtitle-1 text-medium-emphasis">我的订单</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-card class="stat-card fruit-card" elevation="4" rounded="xl">
                            <v-card-text class="pa-6 text-center">
                                <v-icon size="48" color="error" class="mb-3">mdi-cart</v-icon>
                                <div class="text-h4 font-weight-bold text-error">3</div>
                                <div class="text-subtitle-1 text-medium-emphasis">购物车</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-card class="stat-card fruit-card" elevation="4" rounded="xl">
                            <v-card-text class="pa-6 text-center">
                                <v-icon size="48" color="pink" class="mb-3">mdi-heart</v-icon>
                                <div class="text-h4 font-weight-bold text-pink">12</div>
                                <div class="text-subtitle-1 text-medium-emphasis">我的收藏</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-card class="stat-card fruit-card" elevation="4" rounded="xl">
                            <v-card-text class="pa-6 text-center">
                                <v-icon size="48" color="orange" class="mb-3">mdi-star</v-icon>
                                <div class="text-h4 font-weight-bold text-orange">156</div>
                                <div class="text-subtitle-1 text-medium-emphasis">积分余额</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- 快捷操作 -->
                <v-row class="mb-6">
                    <v-col cols="12">
                        <v-card class="fruit-card" elevation="4" rounded="xl">
                            <v-card-title class="text-h5 font-weight-bold">
                                <v-icon start color="primary">mdi-lightning-bolt</v-icon>
                                快捷操作
                            </v-card-title>
                            <v-card-text class="pa-6">
                                <v-row>
                                    <v-col v-for="action in filteredQuickActions" :key="action.title" cols="6" sm="4"
                                        md="3">
                                        <v-card class="action-card fruit-card" variant="outlined" rounded="lg"
                                            @click="handleQuickAction(action)" hover>
                                            <v-card-text class="pa-4 text-center">
                                                <v-icon :color="action.color" size="32" class="mb-2">
                                                    {{ action.icon }}
                                                </v-icon>
                                                <div class="text-subtitle-2 font-weight-medium">{{ action.title }}</div>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- 最近订单和推荐水果 -->
                <v-row>
                    <v-col cols="12" md="8">
                        <v-card class="fruit-card" elevation="4" rounded="xl">
                            <v-card-title class="text-h5 font-weight-bold">
                                <v-icon start color="primary">mdi-package-variant</v-icon>
                                最近订单
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-list>
                                    <v-list-item v-for="order in recentOrders" :key="order.id" class="px-6 py-4">
                                        <template v-slot:prepend>
                                            <v-avatar size="48" :color="order.statusColor" class="me-4">
                                                <v-icon color="white">{{ order.icon }}</v-icon>
                                            </v-avatar>
                                        </template>
                                        <v-list-item-title class="font-weight-medium">
                                            {{ order.title }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ order.date }} · ¥{{ order.amount }}
                                        </v-list-item-subtitle>
                                        <template v-slot:append>
                                            <v-chip :color="order.statusColor" size="small" variant="flat">
                                                {{ order.status }}
                                            </v-chip>
                                        </template>
                                    </v-list-item>
                                </v-list>
                                <v-card-actions class="px-6 pb-4">
                                    <v-btn color="primary" variant="outlined" block @click="goToOrders">
                                        查看全部订单
                                    </v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- 推荐水果 -->
                    <v-col cols="12" md="4">
                        <v-card class="fruit-card" elevation="4" rounded="xl">
                            <v-card-title class="text-h5 font-weight-bold">
                                <v-icon start color="success">mdi-apple</v-icon>
                                推荐水果
                            </v-card-title>
                            <v-card-text class="pa-6">
                                <div v-for="fruit in recommendedFruits" :key="fruit.id" class="mb-4">
                                    <v-card class="fruit-item-card fruit-card" variant="outlined" rounded="lg" hover>
                                        <v-card-text class="pa-4">
                                            <div class="d-flex align-center">
                                                <div class="fruit-emoji me-3">{{ fruit.emoji }}</div>
                                                <div class="flex-grow-1">
                                                    <div class="font-weight-medium">{{ fruit.name }}</div>
                                                    <div class="text-caption text-success">{{ fruit.benefit }}</div>
                                                </div>
                                                <v-chip color="primary" size="small" variant="flat">
                                                    ¥{{ fruit.price }}
                                                </v-chip>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </div>
                                <v-btn color="success" variant="outlined" block @click="goToProducts">
                                    浏览更多水果
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <!-- 头像选择器 -->
        <AvatarSelector v-model="showAvatarSelector" :user="getUserAvatarInfo()"
            :current-avatar-type="currentAvatarType" @select="handleAvatarSelect" />

        <!-- 加载状态 -->
        <v-overlay v-model="loading" contained class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="primary" size="64" indeterminate class="mb-4"></v-progress-circular>
                <div class="text-h6">加载中...</div>
            </div>
        </v-overlay>

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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAvatarStore, type AvatarConfig } from '@/stores/avatar'
import AppNavigation from '@/components/AppNavigation.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AvatarSelector from '@/components/AvatarSelector.vue'

const router = useRouter()
const authStore = useAuthStore()
const avatarStore = useAvatarStore()

// 响应式数据
const loading = ref(false)
const showAvatarSelector = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 使用缓存的用户信息，避免重复请求
const userInfo = computed(() => authStore.userProfile)
const isLoggedIn = computed(() => authStore.isLoggedIn)

// 获取用户头像信息
const getUserAvatarInfo = () => {
    const email = userInfo.value?.email
    const nickname = userInfo.value?.nickname || email?.split('@')[0] || '用户'

    return {
        email: email,
        nickname: nickname,
        id: userInfo.value?.id
    }
}

// 方法
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 头像编辑处理
const handleAvatarEdit = () => {
    console.log('编辑头像')
    showAvatarSelector.value = true
}

// 处理头像选择 - 用户在选择器中选择头像后
const handleAvatarSelect = (config: AvatarConfig) => {
    console.log('✅ 用户选择了新头像:', config)

    // 更新全局头像配置
    avatarStore.updateAvatar(config)

    showMessage('头像已更新', 'success')

    // TODO: 这里可以保存头像配置到后端
    console.log('💾 保存头像配置到后端:', config)

    // 关闭选择器
    showAvatarSelector.value = false
}

// 快捷操作数据
const quickActions = ref([  
    { title: '个人资料', icon: 'mdi-account', color: 'primary', action: 'profile' },
    { title: '浏览商品', icon: 'mdi-storefront', color: 'success', action: 'browse' },
    { title: '我的订单', icon: 'mdi-package-variant', color: 'info', action: 'orders' },
    { title: '购物车', icon: 'mdi-cart', color: 'error', action: 'cart' },
    { title: '我的收藏', icon: 'mdi-heart', color: 'pink', action: 'favorites' },
    { title: '客服中心', icon: 'mdi-help-circle', color: 'orange', action: 'support' },
    { title: '管理后台', icon: 'mdi-cog', color: 'deep-purple', action: 'admin', adminOnly: true }
])

// 计算属性：过滤快捷操作（管理员可以看到管理后台选项）
const filteredQuickActions = computed(() => {
    return quickActions.value.filter(action => {
        if (action.adminOnly) {
            return authStore.isAdmin
        }
        return true
    })
})

// 最近订单数据
const recentOrders = ref([
    {
        id: 1,
        title: '新鲜苹果 2kg',
        date: '2024-01-20',
        amount: '25.60',
        status: '已完成',
        statusColor: 'success',
        icon: 'mdi-check'
    },
    {
        id: 2,
        title: '进口香蕉 1kg',
        date: '2024-01-18',
        amount: '18.90',
        status: '配送中',
        statusColor: 'info',
        icon: 'mdi-truck'
    },
    {
        id: 3,
        title: '有机草莓 500g',
        date: '2024-01-15',
        amount: '32.80',
        status: '已取消',
        statusColor: 'error',
        icon: 'mdi-close'
    }
])

// 推荐水果数据
const recommendedFruits = ref([
    { id: 1, name: '新鲜苹果', emoji: '🍎', benefit: '富含维生素C', price: '12.80' },
    { id: 2, name: '香甜橙子', emoji: '🍊', benefit: '增强免疫力', price: '15.60' },
    { id: 3, name: '营养香蕉', emoji: '🍌', benefit: '补充钾元素', price: '8.90' }
])

// 计算属性
const displayName = computed(() => {
    // 优先使用个人资料中的昵称
    if (userInfo.value?.nickname) {
        return userInfo.value.nickname
    }
    // 其次使用auth store中的昵称
    if (authStore.displayName && authStore.displayName !== '用户') {
        return authStore.displayName
    }
    // 最后使用邮箱前缀
    const authUserInfo = authStore.getUserInfo()
    if (authUserInfo?.email) {
        return authUserInfo.email.split('@')[0]
    }
    return '用户'
})

const userEmail = computed(() => {
    // 优先使用个人资料中的邮箱
    if (userInfo.value?.email) {
        return userInfo.value.email
    }

    // 其次使用认证信息中的邮箱
    const authInfo = authStore.getUserInfo()
    if (authInfo?.email) {
        return authInfo.email
    }

    return '未知邮箱'
})

const userCompletionStatus = computed(() => {
    if (!userInfo.value) {
        return {
            color: 'info',
            icon: 'mdi-loading',
            text: '加载中...'
        }
    }

    // 检查是否完善了个人资料
    const hasBasicInfo = userInfo.value.nickname &&
        userInfo.value.age &&
        userInfo.value.gender &&
        userInfo.value.heightCm &&
        userInfo.value.weightKg

    if (userInfo.value.isCompleted && hasBasicInfo) {
        return {
            color: 'success',
            icon: 'mdi-check-circle',
            text: '资料完整'
        }
    } else if (userInfo.value.nickname) {
        return {
            color: 'warning',
            icon: 'mdi-account-edit',
            text: '部分完善'
        }
    } else {
        return {
            color: 'error',
            icon: 'mdi-alert-circle',
            text: '待完善'
        }
    }
})

// 当前头像类型（从全局状态获取）
const currentAvatarType = computed(() => {
    return avatarStore.currentAvatarType
})

// 新增方法：进入管理员面板
const goToAdminPanel = () => {
    router.push('/zzk')
}

// 快捷操作处理
const handleQuickAction = (action: any) => {
    switch (action.action) {
        case 'profile':
            router.push('/user/profile')
            break
        case 'browse':
            router.push('/products')
            break
        case 'orders':
            router.push('/user/orders')
            break
        case 'cart':
            router.push('/user/cart')
            break
        case 'favorites':
            router.push('/user/favorites')
            break
        case 'support':
            router.push('/support')
            break
        case 'admin':
            goToAdminPanel()
            break
        default:
            console.log('未知操作:', action)
    }
}

const goToOrders = () => {
    router.push('/user/orders')
}

const goToProducts = () => {
    router.push('/products')
}


// 页面挂载时检查用户信息
onMounted(async () => {
    console.log('🔍 UserDashboard 页面加载')

    if (!isLoggedIn.value) {
        console.log('❌ 未登录，跳转到登录页')
        router.replace('/login')
        return
    }

    // 如果用户信息未加载，则加载，避免重复请求
    if (!authStore.userProfileLoaded) {
        console.log('📋 UserDashboard: 用户信息未加载，开始加载')
        await authStore.loadUserProfile()
    } else {
        console.log('📋 UserDashboard: 使用已缓存的用户信息')
    }

    // 检查管理员权限
    if (!authStore.adminStatusChecked && userInfo.value?.email) {
        await authStore.checkAdmin(userInfo.value.email)
    }
})
</script>

<style scoped>
.user-dashboard {
    min-height: 100vh;
    background: #f5f5f5;
}

.dashboard-content {
    margin-top: 64px;
    /* 为导航栏留出空间 */
}

/* 用户信息卡片 */
.user-info-card {
    overflow: hidden;
}

.user-info-header {
    padding: 32px 24px;
    color: white;
}

.user-info-content {
    display: flex;
    align-items: center;
    gap: 24px;
}

.avatar-section {
    flex-shrink: 0;
}

.avatar-wrapper {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 50%;
    padding: 4px;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-wrapper:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.user-dashboard-avatar {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.avatar-edit-hint {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    padding: 4px 8px;
    border-radius: 12px;
    opacity: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.avatar-wrapper:hover .avatar-edit-hint {
    opacity: 1;
    bottom: -4px;
}

.user-basic-info {
    flex: 1;
}

.user-name {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-email {
    font-size: 1rem;
    margin-bottom: 12px;
}

/* 统计卡片 */
.stat-card {
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
}

/* 快捷操作卡片 */
.action-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.action-card:hover {
    transform: translateY(-2px);
    border-color: rgba(76, 175, 80, 0.5) !important;
}

/* 水果emoji */
.fruit-emoji {
    font-size: 2rem;
}

.fruit-item-card {
    transition: all 0.3s ease;
}

.fruit-item-card:hover {
    border-color: rgba(76, 175, 80, 0.5) !important;
}

/* 管理员入口样式 */
.admin-entry-chip {
    cursor: pointer;
    transition: all 0.3s ease;
}

.admin-entry-chip:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(103, 58, 183, 0.4);
}

.admin-quick-entry {
    flex-shrink: 0;
}

.admin-dashboard-btn {
    background: linear-gradient(135deg, #673AB7 0%, #9C27B0 100%) !important;
    box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4) !important;
    transition: all 0.3s ease;
}

.admin-dashboard-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(103, 58, 183, 0.5) !important;
}

/* 管理员统计卡片 */
.admin-stats-card {
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%);
    border: 2px solid rgba(103, 58, 183, 0.1);
}

.admin-stat-item {
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
}

.admin-stat-item:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-main-btn {
    background: linear-gradient(135deg, #673AB7 0%, #9C27B0 100%) !important;
    box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4) !important;
    transition: all 0.3s ease;
    padding: 12px 32px !important;
    font-size: 1.1rem !important;
}

.admin-main-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(103, 58, 183, 0.6) !important;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .dashboard-content {
        margin-top: 56px;
    }

    .user-info-content {
        flex-direction: column;
        text-align: center;
        gap: 16px;
    }

    .avatar-wrapper {
        align-self: center;
    }

    .admin-quick-entry {
        width: 100%;
        margin-top: 16px;
    }

    .admin-dashboard-btn {
        width: 100%;
    }

    .admin-main-btn {
        width: 100%;
        font-size: 1rem !important;
    }
}

/* 深色主题支持 */
.v-theme--dark .user-info-card {
    background: rgba(33, 33, 33, 0.95) !important;
}

.v-theme--dark .action-card:hover {
    border-color: rgba(76, 175, 80, 0.7) !important;
}
</style>
