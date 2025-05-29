<template>
    <div class="app-navigation">
        <!-- 统一的导航栏 -->
        <v-app-bar color="primary" density="comfortable" elevation="4" class="app-navigation-bar" fixed>
            <!-- 汉堡菜单按钮 -->
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

            <!-- Logo和标题 -->
            <v-toolbar-title class="font-weight-bold text-white">
                <router-link to="/" class="text-decoration-none text-white">
                    🍎 水果生活
                </router-link>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- 右侧功能按钮 -->
            <div class="d-flex align-center">
                <!-- 搜索按钮 -->
                <v-btn icon color="white" @click="toggleSearch" v-if="showSearchButton">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <!-- 购物车按钮 -->
                <v-btn icon color="white" class="ml-2" @click="goToCart" v-if="showCartButton">
                    <v-badge color="error" :content="cartItemCount" :model-value="cartItemCount > 0">
                        <v-icon>mdi-cart</v-icon>
                    </v-badge>
                </v-btn>

                <!-- 用户头像菜单 - 使用新的头像组件 -->
                <v-menu v-model="userMenu" :close-on-content-click="false" location="bottom end" offset="8">
                    <template v-slot:activator="{ props }">
                        <v-btn icon color="transparent" class="ml-2 user-avatar-btn" v-bind="props"
                            :class="{ 'avatar-active': userMenu }">
                            <UserAvatar v-if="isLoggedIn" :user="getUserAvatarInfo()" :size="32" clickable />
                            <v-avatar v-else size="32" color="grey-lighten-2">
                                <v-icon size="20" color="grey-darken-2">
                                    mdi-account-circle-outline
                                </v-icon>
                            </v-avatar>
                        </v-btn>
                    </template>

                    <!-- 用户菜单内容 -->
                    <v-card class="user-menu-card" min-width="280" elevation="8" rounded="xl">
                        <!-- 已登录用户的菜单 -->
                        <div v-if="isLoggedIn">
                            <!-- 用户信息头部 -->
                            <v-card-title class="user-menu-header pa-4">
                                <div class="d-flex align-center">
                                    <UserAvatar :user="getUserAvatarInfo()" :size="48" class="me-3" />
                                    <div class="flex-grow-1">
                                        <!-- 显示用户昵称或处理后的显示名 -->
                                        <div class="text-h6 font-weight-bold">{{ displayName }}</div>
                                        <!-- 显示邮箱，优先使用个人资料中的邮箱 -->
                                        <div class="text-caption text-medium-emphasis">
                                            {{ getUserEmail() }}
                                        </div>
                                        <!-- 完善状态指示 -->
                                        <v-chip size="x-small" :color="userCompletionStatus.color" variant="flat"
                                            class="mt-1">
                                            <v-icon start size="12">{{ userCompletionStatus.icon }}</v-icon>
                                            {{ userCompletionStatus.text }}
                                        </v-chip>
                                    </div>
                                </div>
                            </v-card-title>

                            <v-divider></v-divider>

                            <!-- 菜单项 -->
                            <v-list density="compact" class="pa-2">
                                <!-- 主要功能 -->
                                <v-list-item v-for="item in loggedInMenuItems" :key="item.title"
                                    :prepend-icon="item.icon" :title="item.title" :subtitle="item.subtitle"
                                    @click="handleMenuClick(item)" class="menu-item" rounded="lg">
                                    <template v-slot:append v-if="item.badge">
                                        <v-chip size="x-small" :color="item.badge.color" variant="flat">
                                            {{ item.badge.text }}
                                        </v-chip>
                                    </template>
                                </v-list-item>

                                <v-divider class="my-2"></v-divider>

                                <!-- 设置和退出 -->
                                <v-list-item prepend-icon="mdi-cog" title="设置" subtitle="个人偏好设置"
                                    @click="handleMenuClick({ action: 'settings' })" class="menu-item"
                                    rounded="lg"></v-list-item>

                                <v-list-item prepend-icon="mdi-logout" title="退出登录" subtitle="安全退出账户"
                                    @click="handleLogout" class="menu-item text-error" rounded="lg"></v-list-item>
                            </v-list>
                        </div>

                        <!-- 未登录用户的菜单 -->
                        <div v-else>
                            <v-card-title class="guest-menu-header pa-4 text-center">
                                <div>
                                    <UserAvatar :size="64" class="mb-3" />
                                    <div class="text-h6 font-weight-bold mb-1">欢迎来到水果生活</div>
                                    <div class="text-caption text-medium-emphasis">
                                        登录后享受更多功能
                                    </div>
                                </div>
                            </v-card-title>

                            <v-divider></v-divider>

                            <v-card-text class="pa-4">
                                <!-- 登录注册按钮 -->
                                <div class="d-flex gap-2 mb-3">
                                    <v-btn color="primary" variant="flat" block @click="navigateToLogin"
                                        class="font-weight-bold">
                                        <v-icon start>mdi-login</v-icon>
                                        登录
                                    </v-btn>
                                    <v-btn color="primary" variant="outlined" block @click="navigateToRegister">
                                        <v-icon start>mdi-account-plus</v-icon>
                                        注册
                                    </v-btn>
                                </div>

                                <!-- 游客功能 -->
                                <v-list density="compact">
                                    <v-list-subheader class="text-caption">游客功能</v-list-subheader>
                                    <v-list-item v-for="item in guestMenuItems" :key="item.title"
                                        :prepend-icon="item.icon" :title="item.title" @click="handleMenuClick(item)"
                                        class="menu-item" rounded="lg"></v-list-item>
                                </v-list>
                            </v-card-text>
                        </div>
                    </v-card>
                </v-menu>
            </div>
        </v-app-bar>

        <!-- 侧边导航抽屉 -->
        <v-navigation-drawer v-model="drawer" temporary class="app-drawer" width="320">
            <!-- 用户信息头部 -->
            <div class="drawer-header">
                <v-card color="primary" class="pa-4" flat>
                    <div class="d-flex align-center" v-if="isLoggedIn">
                        <UserAvatar :user="getUserAvatarInfo()" :size="60" class="mr-4" />
                        <div>
                            <h3 class="text-white font-weight-bold">{{ displayName }}</h3>
                            <p class="text-white text-body-2 mb-0">欢迎回来！</p>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        <UserAvatar :size="60" class="mb-3" />
                        <div>
                            <v-btn color="white" variant="outlined" size="small" @click="navigateToLogin" class="mr-2">
                                登录
                            </v-btn>
                            <v-btn color="white" variant="text" size="small" @click="navigateToRegister">
                                注册
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </div>

            <!-- 导航菜单 -->
            <v-list nav class="pa-0">
                <!-- 主要功能 -->
                <v-list-group value="main" :model-value="activeGroup">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-home">
                            <v-list-item-title>主要功能</v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-list-item v-for="item in mainMenuItems" :key="item.title" :to="item.to"
                        :active="route.path === item.to" @click="closeDrawer" :prepend-icon="item.icon"
                        class="menu-sub-item">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>

                <!-- 用户功能（仅登录后显示） -->
                <v-list-group value="user" v-if="isLoggedIn" :model-value="activeGroup">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-account">
                            <v-list-item-title>我的账户</v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-list-item v-for="item in userMenuItems" :key="item.title" :to="item.to"
                        :active="route.path === item.to" @click="closeDrawer" :prepend-icon="item.icon"
                        class="menu-sub-item">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>

                <!-- 商品分类 -->
                <v-list-group value="categories">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-fruit-grapes">
                            <v-list-item-title>商品分类</v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-list-item v-for="category in categories" :key="category.name"
                        @click="handleCategoryClick(category)" :prepend-icon="category.icon" class="menu-sub-item">
                        <v-list-item-title>{{ category.name }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>

                <v-divider class="my-2"></v-divider>

                <!-- 其他功能 -->
                <v-list-item v-for="item in otherMenuItems" :key="item.title" :to="item.to"
                    :active="route.path === item.to" @click="closeDrawer" :prepend-icon="item.icon">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>

                <!-- 退出登录（仅登录后显示） -->
                <v-list-item v-if="isLoggedIn" @click="handleLogout" prepend-icon="mdi-logout" class="text-error">
                    <v-list-item-title>退出登录</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- 搜索栏 -->
        <v-expand-transition>
            <v-card v-show="showSearch" class="search-card" elevation="8">
                <v-card-text class="pa-4">
                    <v-text-field v-model="searchQuery" placeholder="搜索您喜欢的水果..." prepend-inner-icon="mdi-magnify"
                        variant="outlined" hide-details clearable @keyup.enter="handleSearch" class="search-input">
                        <template v-slot:append>
                            <v-btn color="primary" variant="flat" @click="handleSearch" :disabled="!searchQuery">
                                搜索
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-card-text>
            </v-card>
        </v-expand-transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAvatarStore } from '@/stores/avatar'
import { getUserInfo, checkUserInfoCompleted, type UserInfoVo } from '@/api/profile'
import UserAvatar from './UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const avatarStore = useAvatarStore()

// Props
interface Props {
    showSearchButton?: boolean
    showCartButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showSearchButton: true,
    showCartButton: true
})

// 响应式数据
const drawer = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const cartItemCount = ref(3) // 模拟购物车数量
const userMenu = ref(false)
const userInfo = ref<UserInfoVo | null>(null)

// 主要菜单项
const mainMenuItems = ref([
    { title: '首页', icon: 'mdi-home', to: '/' },
    { title: '商品列表', icon: 'mdi-storefront', to: '/products' },
    { title: '特价促销', icon: 'mdi-tag-heart', to: '/promotions' },
    { title: '关于我们', icon: 'mdi-information', to: '/about' }
])

// 用户菜单项
const userMenuItems = ref([
    { title: '用户中心', icon: 'mdi-view-dashboard', to: '/user' },
    { title: '我的订单', icon: 'mdi-package-variant', to: '/user/orders' },
    { title: '购物车', icon: 'mdi-cart', to: '/user/cart' },
    { title: '我的收藏', icon: 'mdi-heart', to: '/user/favorites' },
    { title: '个人资料', icon: 'mdi-account', to: '/user/profile' }, // 更新链接
    { title: '完善资料', icon: 'mdi-account-edit', to: '/user/profile-wizard' }
])

// 其他菜单项
const otherMenuItems = ref([
    { title: '客服中心', icon: 'mdi-help-circle', to: '/support' },
    { title: '意见反馈', icon: 'mdi-message-alert', to: '/feedback' },
    { title: '设置', icon: 'mdi-cog', to: '/settings' }
])

// 商品分类
const categories = ref([
    { name: '新鲜水果', icon: 'mdi-apple', color: 'red' },
    { name: '热带水果', icon: 'mdi-fruit-pineapple', color: 'orange' },
    { name: '浆果类', icon: 'mdi-fruit-grapes', color: 'purple' },
    { name: '柑橘类', icon: 'mdi-fruit-citrus', color: 'orange' },
    { name: '核果类', icon: 'mdi-fruit-cherries', color: 'pink' },
    { name: '进口水果', icon: 'mdi-airplane', color: 'blue' }
])

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn)
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

// 获取用户邮箱 - 优先使用个人资料
const getUserEmail = () => {
    // 如果有个人资料，且包含邮箱，使用个人资料中的邮箱
    if (userInfo.value?.email) {
        return userInfo.value.email
    }

    // 否则使用认证信息中的邮箱
    const authInfo = authStore.getUserInfo()
    if (authInfo?.email) {
        return authInfo.email
    }

    return '未知邮箱'
}

// 获取用户头像信息 - 修复逻辑
const getUserAvatarInfo = () => {
    const email = getUserEmail()
    const nickname = displayName.value

    return {
        // 只有当邮箱不是"未知邮箱"时才传递
        email: email !== '未知邮箱' ? email : undefined,
        // 优先使用个人资料昵称，避免使用邮箱前缀作为昵称
        nickname: userInfo.value?.nickname || nickname,
        id: userInfo.value?.id
    }
}

// 用户完善状态 - 基于实际加载的用户信息
const userCompletionStatus = computed(() => {
    if (!isLoggedIn.value) {
        return {
            color: 'grey',
            icon: 'mdi-account-circle-outline',
            text: '未登录'
        }
    }

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

// 已登录用户菜单项
const loggedInMenuItems = computed(() => [
    {
        title: '用户中心',
        subtitle: '查看个人信息',
        icon: 'mdi-view-dashboard',
        action: 'dashboard'
    },
    {
        title: '个人资料',
        subtitle: '查看和编辑资料',
        icon: 'mdi-account',
        action: 'profile'
    },
    {
        title: '我的订单',
        subtitle: '查看订单历史',
        icon: 'mdi-package-variant',
        action: 'orders'
    },
    {
        title: '购物车',
        subtitle: `${cartItemCount.value} 件商品`,
        icon: 'mdi-cart',
        action: 'cart',
        badge: cartItemCount.value > 0 ? {
            color: 'error',
            text: cartItemCount.value.toString()
        } : undefined
    },
    {
        title: '我的收藏',
        subtitle: '收藏的商品',
        icon: 'mdi-heart',
        action: 'favorites'
    }
])

// 游客菜单项
const guestMenuItems = ref([
    {
        title: '浏览商品',
        icon: 'mdi-storefront',
        action: 'products'
    },
    {
        title: '特价促销',
        icon: 'mdi-tag-heart',
        action: 'promotions'
    },
    {
        title: '关于我们',
        icon: 'mdi-information',
        action: 'about'
    },
    {
        title: '客服中心',
        icon: 'mdi-help-circle',
        action: 'support'
    }
])

// 当前激活的菜单项
const activeGroup = ref<string[]>([])

// 根据当前路由设置激活的菜单组
const setActiveMenuFromRoute = () => {
    const currentPath = route.path

    // 清空之前的激活状态
    activeGroup.value = []

    // 根据路径判断应该激活哪个菜单组
    if (currentPath.startsWith('/user')) {
        if (isLoggedIn.value) {
            activeGroup.value = ['user']
        }
    } else if (currentPath === '/' || currentPath === '/products' || currentPath === '/promotions' || currentPath === '/about') {
        activeGroup.value = ['main']
    }
    // 不自动展开任何菜单组，让用户主动点击
}

// 监听路由变化
watch(() => route.path, () => {
    setActiveMenuFromRoute()
}, { immediate: true })

// 方法
const closeDrawer = () => {
    drawer.value = false
}

const navigateToLogin = () => {
    closeDrawer()
    userMenu.value = false
    router.push('/login')
}

const navigateToRegister = () => {
    closeDrawer()
    userMenu.value = false
    router.push('/register')
}

const toggleSearch = () => {
    showSearch.value = !showSearch.value
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        console.log('搜索:', searchQuery.value)
        showSearch.value = false
        // TODO: 实现搜索功能
        router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    }
}

const goToCart = () => {
    if (isLoggedIn.value) {
        router.push('/user/cart')
    } else {
        router.push('/login')
    }
}

const handleCategoryClick = (category: any) => {
    closeDrawer()
    console.log('点击分类:', category.name)
    // TODO: 实现分类筛选
    router.push(`/products?category=${encodeURIComponent(category.name)}`)
}

const handleLogout = async () => {
    console.log('🚪 导航栏退出登录')

    try {
        // 使用auth store的退出方法
        await authStore.logout()

        closeDrawer()
        userMenu.value = false

        // 跳转到首页
        await router.push('/')
    } catch (error) {
        console.error('导航栏退出登录失败:', error)

        // 即使失败也关闭抽屉并跳转
        closeDrawer()
        userMenu.value = false
        await router.push('/')
    }
}

const handleMenuClick = (item: any) => {
    userMenu.value = false
    closeDrawer()

    switch (item.action) {
        case 'dashboard':
            router.push('/user')
            break
        case 'profile':
            router.push('/user/profile') // 更新链接
            break
        case 'orders':
            router.push('/user/orders')
            break
        case 'cart':
            goToCart()
            break
        case 'favorites':
            router.push('/user/favorites')
            break
        case 'settings':
            router.push('/user/settings')
            break
        case 'products':
            router.push('/products')
            break
        case 'promotions':
            router.push('/promotions')
            break
        case 'about':
            router.push('/about')
            break
        case 'support':
            router.push('/support')
            break
        default:
            console.log('未知菜单项:', item)
    }
}

// 处理用户头像点击（保持向后兼容）
const handleUserAction = () => {
    // 如果菜单未打开，则打开菜单
    if (!userMenu.value) {
        userMenu.value = true
    }
}

// 加载用户信息 - 增强错误处理
const loadUserInfo = async () => {
    if (!isLoggedIn.value) {
        userInfo.value = null
        return
    }

    try {
        console.log('🔍 导航栏开始加载用户信息')
        const response = await getUserInfo()

        if (response.code === 200 && response.data) {
            userInfo.value = response.data
            console.log('✅ 导航栏用户信息加载成功:', {
                nickname: userInfo.value.nickname,
                email: userInfo.value.email,
                isCompleted: userInfo.value.isCompleted
            })
        } else {
            console.warn('⚠️ 导航栏获取用户信息返回异常:', response)
            userInfo.value = null
        }
    } catch (error) {
        console.error('❌ 导航栏加载用户信息失败:', error)
        // 静默处理错误，不影响导航功能
        userInfo.value = null
    }
}

// 监听登录状态变化
watch(isLoggedIn, async (newValue, oldValue) => {
    console.log('🔄 导航栏监听到登录状态变化:', { from: oldValue, to: newValue })

    if (newValue) {
        // 登录时初始化头像配置和加载用户信息
        await avatarStore.initializeAvatar()  // 确保头像配置被正确加载
        await loadUserInfo()
    } else {
        // 登出时清除头像配置和用户信息
        avatarStore.clearAvatar()
        userInfo.value = null
        console.log('🗑️ 导航栏已清除用户信息')
    }
}, { immediate: true })
</script>

<style scoped>
.app-navigation {
    position: relative;
}

.app-navigation-bar {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.app-drawer {
    z-index: 1100;
}

.drawer-header {
    position: sticky;
    top: 0;
    z-index: 1;
}

.search-card {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    z-index: 999;
    border-radius: 0 0 16px 16px !important;
}

.search-input {
    max-width: 600px;
    margin: 0 auto;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .search-card {
        top: 56px;
    }
}

/* 二级菜单项样式 */
.menu-sub-item {
    padding-left: 56px !important;
}

/* 激活状态的菜单项 */
:deep(.v-list-item--active) {
    background-color: rgba(76, 175, 80, 0.1) !important;
    color: #4CAF50 !important;
}

:deep(.v-list-item--active .v-list-item-title) {
    color: #4CAF50 !important;
    font-weight: 600 !important;
}

:deep(.v-list-item--active .v-icon) {
    color: #4CAF50 !important;
}

/* 菜单分组标题样式 */
:deep(.v-list-group__header) {
    font-weight: 600 !important;
}

/* 悬停效果 */
:deep(.v-list-item:hover) {
    background-color: rgba(76, 175, 80, 0.05) !important;
}

/* 用户头像按钮样式 */
.user-avatar-btn {
    transition: all 0.3s ease;
}

.user-avatar-btn:hover,
.user-avatar-btn.avatar-active {
    background-color: rgba(255, 255, 255, 0.1) !important;
    transform: scale(1.05);
}

/* 用户菜单卡片 */
.user-menu-card {
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-menu-header {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
}

.guest-menu-header {
    background: linear-gradient(135deg, #607D8B 0%, #90A4AE 100%);
    color: white;
}

/* 菜单项样式 */
.menu-item {
    margin-bottom: 4px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background-color: rgba(76, 175, 80, 0.08) !important;
    transform: translateX(4px);
}

.menu-item.text-error:hover {
    background-color: rgba(244, 67, 54, 0.08) !important;
}

/* 菜单项图标样式 */
:deep(.v-list-item__prepend > .v-icon) {
    opacity: 0.8;
}

.menu-item:hover :deep(.v-list-item__prepend > .v-icon) {
    opacity: 1;
    color: #4CAF50;
}

.menu-item.text-error:hover :deep(.v-list-item__prepend > .v-icon) {
    color: #f44336;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .user-menu-card {
        min-width: 260px;
    }
}

/* 深色主题支持 */
.v-theme--dark .user-menu-card {
    background: rgba(33, 33, 33, 0.95) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
}

.v-theme--dark .menu-item:hover {
    background-color: rgba(76, 175, 80, 0.12) !important;
}
</style>
