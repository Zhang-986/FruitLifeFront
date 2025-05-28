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

                <!-- 用户头像按钮 -->
                <v-btn icon color="white" class="ml-2" @click="handleUserAction">
                    <v-icon>mdi-account-circle</v-icon>
                </v-btn>
            </div>
        </v-app-bar>

        <!-- 侧边导航抽屉 -->
        <v-navigation-drawer v-model="drawer" temporary class="app-drawer" width="320">
            <!-- 用户信息头部 -->
            <div class="drawer-header">
                <v-card color="primary" class="pa-4" flat>
                    <div class="d-flex align-center" v-if="isLoggedIn">
                        <v-avatar size="60" color="white" class="mr-4">
                            <v-icon size="30" color="primary">mdi-account-circle</v-icon>
                        </v-avatar>
                        <div>
                            <h3 class="text-white font-weight-bold">{{ displayName }}</h3>
                            <p class="text-white text-body-2 mb-0">欢迎回来！</p>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        <v-avatar size="60" color="white" class="mb-3">
                            <v-icon size="30" color="primary">mdi-account-circle</v-icon>
                        </v-avatar>
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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

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

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn)
const displayName = computed(() => authStore.displayName)

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
    { title: '个人资料', icon: 'mdi-account-edit', to: '/user/profile' }
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

// 方法
const closeDrawer = () => {
    drawer.value = false
}

const navigateToLogin = () => {
    closeDrawer()
    router.push('/login')
}

const navigateToRegister = () => {
    closeDrawer()
    router.push('/register')
}

const handleLogout = () => {
    authStore.logout()
    closeDrawer()
    router.push('/')
}

const handleUserAction = () => {
    if (isLoggedIn.value) {
        router.push('/user')
    } else {
        router.push('/login')
    }
}

const handleCategoryClick = (category: any) => {
    closeDrawer()
    console.log('点击分类:', category.name)
    // 这里可以跳转到分类页面或筛选商品
}

const toggleSearch = () => {
    showSearch.value = !showSearch.value
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        console.log('搜索:', searchQuery.value)
        showSearch.value = false
        // 这里可以跳转到搜索结果页面
    }
}

const goToCart = () => {
    if (isLoggedIn.value) {
        router.push('/user/cart')
    } else {
        router.push('/login')
    }
}
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
</style>
