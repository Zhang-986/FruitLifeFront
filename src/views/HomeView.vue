<template>
    <div class="home-page">
        <AppNavigation :show-search-button="true" />

        <div class="home-content">
            <!-- 如果用户已登录 -->
            <template v-if="isLoggedIn">
                <!-- 主要内容区域 - 左右布局 -->
                <section class="main-content-section">
                    <v-container>
                        <v-row>
                            <!-- 左侧：今日推荐 (占主要空间) -->
                            <v-col cols="12" lg="8">
                                <div class="today-recommendation-wrapper">
                                    <div class="text-center mb-6">
                                        <h2 class="text-h4 font-weight-bold mb-2">
                                            🍎 今日推荐
                                        </h2>
                                        <p class="text-body-1 text-medium-emphasis">
                                            {{ formatDate(new Date()) }} 的健康选择
                                        </p>
                                    </div>

                                    <!-- 加载状态 -->
                                    <div v-if="loading" class="text-center py-12">
                                        <v-progress-circular color="primary" size="64"
                                            indeterminate></v-progress-circular>
                                        <div class="text-h6 mt-4 text-grey">正在为您精选今日水果...</div>
                                    </div>

                                    <!-- 推荐水果展示 -->
                                    <div v-else-if="dailyFruit" class="daily-fruit-container">
                                        <v-card class="daily-fruit-card" elevation="12" rounded="xl">
                                            <v-row no-gutters>
                                                <!-- 左侧：水果图片 -->
                                                <v-col cols="12" md="5">
                                                    <div class="fruit-image-section">
                                                        <!-- 直接使用emoji展示，不再需要图片 -->
                                                        <div class="fruit-emoji-display">
                                                            <div class="emoji-container">
                                                                <!-- 大号水果emoji -->
                                                                <div class="fruit-emoji">{{
                                                                    getFruitEmoji(dailyFruit.name) }}</div>
                                                                <!-- 水果名称 -->
                                                                <div class="fruit-name-text">{{ dailyFruit.name }}</div>
                                                                <!-- 装饰性元素 -->
                                                                <div class="decoration-dots">
                                                                    <span>✨</span>
                                                                    <span>🌿</span>
                                                                    <span>✨</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- 日期标签 -->
                                                        <v-chip class="date-badge" color="primary" variant="elevated">
                                                            <v-icon start size="small">mdi-calendar-today</v-icon>
                                                            今日推荐
                                                        </v-chip>
                                                    </div>
                                                </v-col>

                                                <!-- 右侧：水果信息 -->
                                                <v-col cols="12" md="7">
                                                    <v-card-text class="pa-6 h-100 d-flex flex-column">
                                                        <!-- 水果标题 -->
                                                        <div class="mb-3">
                                                            <h3 class="text-h4 font-weight-bold fruit-name mb-2">
                                                                {{ dailyFruit.name }}
                                                            </h3>
                                                            <p class="text-body-1 text-medium-emphasis">
                                                                {{ dailyFruit.description || '今天就选它，为健康加分！' }}
                                                            </p>
                                                        </div>

                                                        <!-- 快速信息卡片 -->
                                                        <div class="info-cards-row mb-3">
                                                            <v-row dense>
                                                                <v-col cols="6" v-if="dailyFruit.flavorProfile">
                                                                    <v-card variant="tonal" color="pink" rounded="lg">
                                                                        <v-card-text class="pa-2 text-center">
                                                                            <v-icon color="pink" size="small"
                                                                                class="mb-1">mdi-emoticon-tongue</v-icon>
                                                                            <div class="text-caption">口味</div>
                                                                            <div class="text-body-2 font-weight-medium">
                                                                                {{ dailyFruit.flavorProfile }}</div>
                                                                        </v-card-text>
                                                                    </v-card>
                                                                </v-col>
                                                                <v-col cols="6" v-if="dailyFruit.seasonInfo">
                                                                    <v-card variant="tonal" color="orange" rounded="lg">
                                                                        <v-card-text class="pa-2 text-center">
                                                                            <v-icon color="orange" size="small"
                                                                                class="mb-1">mdi-calendar</v-icon>
                                                                            <div class="text-caption">季节</div>
                                                                            <div class="text-body-2 font-weight-medium">
                                                                                {{ dailyFruit.seasonInfo }}</div>
                                                                        </v-card-text>
                                                                    </v-card>
                                                                </v-col>
                                                            </v-row>
                                                        </div>

                                                        <!-- 营养价值 -->
                                                        <div v-if="dailyFruit.nutritionSummary" class="mb-3">
                                                            <v-card variant="tonal" color="success" rounded="lg">
                                                                <v-card-text class="pa-2">
                                                                    <div class="d-flex align-center mb-1">
                                                                        <v-icon color="success" size="small"
                                                                            class="mr-2">mdi-nutrition</v-icon>
                                                                        <span
                                                                            class="text-caption font-weight-medium">营养价值</span>
                                                                    </div>
                                                                    <div class="text-body-2">{{
                                                                        dailyFruit.nutritionSummary }}</div>
                                                                </v-card-text>
                                                            </v-card>
                                                        </div>

                                                        <!-- 健康功效标签 - 紧凑显示 -->
                                                        <div v-if="getLifePropertiesArray(dailyFruit).length"
                                                            class="mb-3 flex-grow-1">
                                                            <div
                                                                class="text-body-2 font-weight-medium mb-1 d-flex align-center">
                                                                <v-icon color="primary" size="small"
                                                                    class="mr-1">mdi-tag-multiple</v-icon>
                                                                健康功效
                                                            </div>
                                                            <div class="d-flex flex-wrap ga-1">
                                                                <v-chip
                                                                    v-for="property in getLifePropertiesArray(dailyFruit).slice(0, 4)"
                                                                    :key="property" color="primary" variant="tonal"
                                                                    size="x-small">
                                                                    {{ property }}
                                                                </v-chip>
                                                                <v-chip
                                                                    v-if="getLifePropertiesArray(dailyFruit).length > 4"
                                                                    color="grey" variant="tonal" size="x-small">
                                                                    +{{ getLifePropertiesArray(dailyFruit).length - 4 }}
                                                                </v-chip>
                                                            </div>
                                                        </div>

                                                        <!-- 操作按钮 -->
                                                        <div class="d-flex ga-2 mt-auto">
                                                            <v-btn color="primary" variant="flat" rounded="lg"
                                                                @click="exploreFruit" class="flex-grow-1">
                                                                <v-icon start size="small">mdi-magnify</v-icon>
                                                                了解更多水果
                                                            </v-btn>
                                                        </div>
                                                    </v-card-text>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </div>

                                    <!-- 错误状态 -->
                                    <div v-else class="text-center py-12">
                                        <v-icon size="64" color="grey-lighten-2">mdi-alert-circle</v-icon>
                                        <div class="text-h6 mt-4 text-grey">今日推荐暂时无法加载</div>
                                        <v-btn color="primary" variant="outlined" @click="loadDailyFruit" class="mt-4">
                                            <v-icon start>mdi-refresh</v-icon>
                                            重新加载
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>

                            <!-- 右侧：功能面板 (紧凑布局) -->
                            <v-col cols="12" lg="4">
                                <div class="function-panel">
                                    <!-- 用户状态卡片 -->
                                    <v-card class="user-status-card mb-4" elevation="6" rounded="xl">
                                        <v-card-text class="pa-4">
                                            <div class="text-center mb-3">
                                                <div class="welcome-text">欢迎回来, {{ username }}! 👋</div>
                                            </div>

                                            <!-- 紧凑的状态显示 -->
                                            <v-row dense>
                                                <v-col cols="4">
                                                    <div class="status-item" @click="goToPointsCenter">
                                                        <div class="status-icon">💰</div>
                                                        <div class="status-value">{{ userPoints.toLocaleString() }}
                                                        </div>
                                                        <div class="status-label">积分</div>
                                                    </div>
                                                </v-col>
                                                <v-col cols="4">
                                                    <div class="status-item" @click="goToInventory">
                                                        <div class="status-icon">🧺</div>
                                                        <div class="status-value">{{ inventoryCount }}</div>
                                                        <div class="status-label">库存</div>
                                                    </div>
                                                </v-col>
                                                <v-col cols="4">
                                                    <div class="status-item" @click="handleCheckIn"
                                                        :class="{ 'checked-in': todayCheckedIn }">
                                                        <div class="status-icon">{{ todayCheckedIn ? '✅' : '📅' }}</div>
                                                        <div class="status-value">{{ consecutiveDays }}</div>
                                                        <div class="status-label">{{ todayCheckedIn ? '已签到' : '签到' }}
                                                        </div>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>

                                    <!-- 快捷功能网格 -->
                                    <v-card class="quick-functions-card mb-4" elevation="6" rounded="xl">
                                        <v-card-title class="pa-3 pb-1">
                                            <span class="text-h6">🚀 快捷功能</span>
                                        </v-card-title>
                                        <v-card-text class="pa-3 pt-1">
                                            <v-row dense>
                                                <v-col cols="6" sm="4" v-for="action in quickActions"
                                                    :key="action.title">
                                                    <div class="quick-action-item" @click="action.handler">
                                                        <div class="action-icon">{{ action.icon }}</div>
                                                        <div class="action-title">{{ action.title }}</div>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>

                                    <!-- 健康小贴士 -->
                                    <v-card class="health-tip-card" elevation="6" rounded="xl">
                                        <v-card-title class="pa-3 pb-1">
                                            <span class="text-h6">💡 健康贴士</span>
                                        </v-card-title>
                                        <v-card-text class="pa-3 pt-1">
                                            <p class="text-body-2 mb-2">{{ todayHealthTip }}</p>
                                            <v-btn color="primary" variant="text" size="small"
                                                @click="refreshHealthTip">
                                                <v-icon start size="small">mdi-refresh</v-icon>
                                                换一条
                                            </v-btn>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </section>
            </template>

            <!-- 如果用户未登录 -->
            <template v-else>
                <section class="guest-welcome-section">
                    <v-container>
                        <div class="text-center py-16">
                            <div class="guest-icon mb-6">🍓</div>
                            <h1 class="text-h2 font-weight-bold mb-4 guest-title">
                                探索每日水果推荐
                            </h1>
                            <p class="text-h5 mb-8 text-medium-emphasis">
                                登录后每天为您推荐一款健康水果<br />开启您的个性化健康之旅
                            </p>
                            <div class="d-flex justify-center ga-4">
                                <v-btn color="primary" size="x-large" rounded="xl" elevation="4" @click="login">
                                    <v-icon start>mdi-login-variant</v-icon>
                                    立即登录
                                </v-btn>
                                <v-btn color="secondary" variant="outlined" size="x-large" rounded="xl"
                                    @click="register">
                                    <v-icon start>mdi-account-plus-outline</v-icon>
                                    免费注册
                                </v-btn>
                            </div>
                        </div>
                    </v-container>
                </section>
            </template>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/AppNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { getFruitByName, type Fruit } from '@/api/fruit'
import { getTodayFruitName, getTodayDateString, isNewDay } from '@/utils/daily-fruit'

const authStore = useAuthStore()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const dailyFruit = ref<Fruit | null>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 新增响应式数据
const userPoints = ref(1250) // 模拟用户积分
const inventoryCount = ref(12) // 模拟库存数量
const consecutiveDays = ref(7) // 模拟连续签到天数
const todayCheckedIn = ref(false) // 今日是否已签到
const todayHealthTip = ref('每天食用2-3种不同颜色的水果，能够获得更全面的营养素。') // 健康小贴士

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn)
const username = computed(() => authStore.displayName)

// 用户等级信息
const userLevel = ref({
    level: 2,
    name: '健康达人',
    minPoints: 500,
    maxPoints: 2000,
    benefits: ['每日任务', 'AI基础建议']
})

// 健康小贴士库
const healthTips = [
    '每天食用2-3种不同颜色的水果，能够获得更全面的营养素。',
    '饭后半小时食用水果有助于消化，避免餐前大量食用。',
    '应季水果不仅新鲜美味，营养价值也更高，价格更实惠。',
    '水果最好在上午或下午食用，晚上食用可能影响消化。',
    '有机水果虽然价格较高，但农药残留更少，更安全健康。',
    '冷冻水果也是不错的选择，营养成分基本不会流失。',
    '榨汁不如直接食用水果，能保留更多膳食纤维。',
    '糖尿病患者应选择低糖水果，如苹果、柚子等。'
]

// 方法
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
}

const getLifePropertiesArray = (fruit: Fruit): string[] => {
    if (!fruit?.lifeProperties) {
        return []
    }

    try {
        if (Array.isArray(fruit.lifeProperties)) {
            return fruit.lifeProperties
        }

        if (typeof fruit.lifeProperties === 'string') {
            if (!fruit.lifeProperties.trim()) {
                return []
            }
            const parsed = JSON.parse(fruit.lifeProperties)
            return Array.isArray(parsed) ? parsed : []
        }

        return []
    } catch (error) {
        console.error('解析生活属性失败:', error)
        return []
    }
}

const loadDailyFruit = async () => {
    loading.value = true

    try {
        // 检查缓存
        const cacheKey = 'dailyFruit'
        const cacheDateKey = 'dailyFruitDate'
        const cachedDate = localStorage.getItem(cacheDateKey)
        const today = getTodayDateString()

        // 如果是新的一天或没有缓存，重新获取
        if (!cachedDate || isNewDay(cachedDate)) {
            console.log('🍎 获取今日推荐水果')

            const todayFruitName = getTodayFruitName()
            console.log(`📅 今日推荐: ${todayFruitName}`)

            const response = await getFruitByName(todayFruitName)

            if (response.code === 200 && response.data) {
                dailyFruit.value = response.data

                // 缓存数据
                localStorage.setItem(cacheKey, JSON.stringify(response.data))
                localStorage.setItem(cacheDateKey, today)

                console.log('✅ 今日推荐水果加载成功:', response.data.name)
                showMessage(`今日为您推荐：${response.data.name}`, 'success')
            } else {
                console.error('❌ 获取今日推荐失败:', response)
                showMessage('获取今日推荐失败，请稍后重试', 'error')
            }
        } else {
            // 使用缓存数据
            const cachedFruit = localStorage.getItem(cacheKey)
            if (cachedFruit) {
                dailyFruit.value = JSON.parse(cachedFruit)
                console.log('📦 使用缓存的今日推荐:', dailyFruit.value?.name)
            }
        }
    } catch (error) {
        console.error('❌ 加载今日推荐失败:', error)
        showMessage('加载失败，请检查网络连接', 'error')
    } finally {
        loading.value = false
    }
}

const exploreFruit = () => {
    console.log('🔍 探索更多水果')
    router.push('/products')
}

const login = () => {
    console.log('🚀 跳转到登录页面')
    router.push('/login')
}

const register = () => {
    console.log('✨ 跳转到注册页面')
    router.push('/register')
}

// 先定义所有的方法函数
const goToPointsCenter = () => {
    console.log('🏆 跳转到积分中心')
    router.push('/user/points')
}

const goToMarket = () => {
    console.log('🛒 跳转到水果商城')
    router.push('/market')
}

const goToAI = () => {
    console.log('🤖 跳转到AI助手')
    router.push('/ai-assistant')
}

const goToInventory = () => {
    console.log('🧺 跳转到我的库存')
    router.push('/user/inventory')
}

const goToAnalysis = () => {
    console.log('📊 跳转到营养分析')
    router.push('/user/nutrition-analysis')
}

const goToProfile = () => {
    console.log('👤 跳转到个人资料')
    router.push('/user/profile')
}

const handleCheckIn = () => {
    if (todayCheckedIn.value) {
        showMessage('今日已经签到过了！', 'info')
        return
    }

    // 模拟签到逻辑
    todayCheckedIn.value = true
    consecutiveDays.value += 1

    // 计算签到奖励积分
    const basePoints = 20 // 基础签到积分
    const bonusPoints = Math.min(consecutiveDays.value, 7) * 2 // 连续奖励，最高14分
    const totalPoints = basePoints + bonusPoints

    userPoints.value += totalPoints

    console.log('✅ 签到成功，获得积分:', totalPoints)
    showMessage(`签到成功！获得 ${totalPoints} 积分，连续签到 ${consecutiveDays.value} 天`, 'success')
}

const refreshHealthTip = () => {
    const currentTip = todayHealthTip.value
    let newTip = currentTip

    // 确保不会显示相同的提示
    while (newTip === currentTip) {
        newTip = healthTips[Math.floor(Math.random() * healthTips.length)]
    }

    todayHealthTip.value = newTip
    showMessage('已为您更换健康小贴士', 'success')
}

// 然后定义使用这些函数的响应式数据
const quickActions = ref([
    { title: '水果商城', icon: '🛒', handler: goToMarket },
    { title: 'AI助手', icon: '🤖', handler: goToAI },
    { title: '我的库存', icon: '🧺', handler: goToInventory },
    { title: '积分中心', icon: '💰', handler: goToPointsCenter },
    { title: '营养分析', icon: '📊', handler: goToAnalysis },
    { title: '个人资料', icon: '👤', handler: goToProfile }
])

// 保留并增强获取水果emoji方法
const getFruitEmoji = (fruitName: string): string => {
    const emojiMap: Record<string, string> = {
        // 常见水果
        '苹果': '🍎', '香蕉': '🍌', '橙子': '🍊', '葡萄': '🍇', '草莓': '🍓',
        '西瓜': '🍉', '猕猴桃': '🥝', '菠萝': '🍍', '芒果': '🥭', '樱桃': '🍒',
        '桃子': '🍑', '梨': '🍐', '蓝莓': '🫐', '火龙果': '🐲', '榴莲': '🥴',

        // 热带水果
        '椰子': '🥥', '木瓜': '🧡', '番石榴': '🍈', '红毛丹': '🔴', '山竹': '🟣',
        '莲雾': '💧', '杨桃': '⭐', '释迦': '🤍', '牛油果': '🥑', '百香果': '💛',
        '龙眼': '👁️', '荔枝': '🔴', '人参果': '🌟', '神秘果': '❓', '嘉宝果': '🟣', '黄皮': '🟡',

        // 浆果类
        '黑莓': '⚫', '覆盆子': '🔴', '桑葚': '🟣', '醋栗': '🟢', '鹅莓': '🟢',
        '沙棘': '🟠', '枸杞': '🔴', '蔓越莓': '🔴', '黑加仑': '⚫', '红加仑': '🔴',

        // 柑橘类
        '柚子': '🟡', '柠檬': '🍋', '青柠': '🟢', '金桔': '🟠', '砂糖橘': '🟠',
        '沃柑': '🟠', '血橙': '🔴', '佛手柑': '🟡', '香橙': '🟠', '甜橙': '🟠',

        // 核果类
        '杏': '🟡', '李子': '🟣', '梅子': '🟢', '油桃': '🍑', '蟠桃': '🍑',
        '黄桃': '🟡', '水蜜桃': '🍑', '紫李': '🟣', '青梅': '🟢', '乌梅': '⚫',

        // 瓜果类
        '哈密瓜': '🍈', '香瓜': '🍈', '甜瓜': '🍈', '白兰瓜': '🤍', '伊丽莎白瓜': '👑',
        '金丝瓜': '🟡', '羊角蜜': '🐏', '网纹瓜': '🕸️', '黄河蜜': '🟡', '脆瓜': '💎',

        // 坚果类
        '核桃': '🥜', '杏仁': '🥜', '榛子': '🥜', '开心果': '🥜', '腰果': '🥜',
        '夏威夷果': '🥜', '碧根果': '🥜', '巴旦木': '🥜', '松子': '🥜', '板栗': '🌰',
        '银杏': '🟡', '白果': '⚪', '花生': '🥜', '瓜子': '🌻',

        // 进口水果
        '车厘子': '🍒', '奇异果': '🥝', '提子': '🍇', '无花果': '🟣', '橄榄': '🫒',
        '石榴': '🔴', '柿子': '🟠', '枣': '🔴', '山楂': '🔴', '酸枣': '🟢'
    }

    return emojiMap[fruitName] || '🍎' // 默认苹果emoji
}

// 生命周期
onMounted(async () => {
    // 初始化认证状态
    if (!authStore.token) {
        authStore.initializeAuth()
    }

    // 如果用户已登录，加载今日推荐
    if (isLoggedIn.value) {
        // 加载用户详细信息（如果需要）
        if (!authStore.userProfileLoaded) {
            try {
                await authStore.loadUserProfile()
            } catch (error) {
                console.error('❌ 加载用户信息失败:', error)
            }
        }

        // 加载今日推荐水果
        await loadDailyFruit()

        console.log(`🍎 欢迎回来, ${username.value}! 今日推荐已为您准备好！`)
    } else {
        console.log('🍎 游客你好, 登录后获取每日水果推荐！')
    }
})
</script>

<style scoped>
.home-page {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.home-content {
    margin-top: 64px;
}

/* 主内容区块 */
.main-content-section {
    padding: 40px 0;
    min-height: calc(100vh - 64px);
}

.today-recommendation-wrapper {
    height: 100%;
}

/* 右侧功能面板 */
.function-panel {
    position: sticky;
    top: 80px;
    height: fit-content;
}

/* 用户状态卡片 */
.user-status-card {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%);
    border-left: 4px solid #4CAF50;
}

.welcome-text {
    font-size: 1rem;
    font-weight: 600;
    color: #2E7D32;
}

.status-item {
    text-align: center;
    padding: 8px 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.status-item:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: translateY(-2px);
}

.status-item.checked-in {
    background: rgba(76, 175, 80, 0.1);
}

.status-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
}

.status-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2E7D32;
    margin-bottom: 2px;
}

.status-label {
    font-size: 0.7rem;
    color: #666;
}

/* 快捷功能卡片 */
.quick-functions-card {
    background: rgba(255, 255, 255, 0.95);
}

.quick-action-item {
    text-align: center;
    padding: 12px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(76, 175, 80, 0.05);
    margin-bottom: 8px;
}

.quick-action-item:hover {
    background: rgba(76, 175, 80, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
}

.action-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
}

/* 健康贴士卡片 */
.health-tip-card {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(100, 181, 246, 0.05) 100%);
    border-left: 4px solid #2196F3;
}

/* 调整今日推荐卡片 */
.daily-fruit-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    overflow: hidden;
}

.daily-fruit-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

.fruit-image-section {
    position: relative;
    overflow: hidden;
    height: 350px;
}

.fruit-emoji-display {
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    position: relative;
    overflow: hidden;
}

.emoji-container {
    text-align: center;
    padding: 20px;
    position: relative;
    z-index: 1;
}

.fruit-emoji {
    font-size: 4rem;
    margin-bottom: 16px;
    animation: fruitFloat 3s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
    display: block;
}

.fruit-name-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2E7D32;
    margin-bottom: 12px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.decoration-dots {
    display: flex;
    justify-content: center;
    gap: 16px;
    font-size: 1.2rem;
}

.decoration-dots span {
    animation: sparkle 2s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.5s);
}

.decoration-dots span:nth-child(1) {
    --i: 0;
}

.decoration-dots span:nth-child(2) {
    --i: 1;
}

.decoration-dots span:nth-child(3) {
    --i: 2;
}

.fruit-emoji-display::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
        radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 195, 74, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
    animation: backgroundFloat 8s ease-in-out infinite;
    z-index: 0;
}

.date-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1;
}

.fruit-name {
    color: #4CAF50;
}

.info-cards-row .v-card {
    height: 60px;
}

.info-cards-row .v-card-text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 水果浮动动画 */
@keyframes fruitFloat {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg) scale(1);
    }

    25% {
        transform: translateY(-8px) rotate(1deg) scale(1.02);
    }

    50% {
        transform: translateY(-12px) rotate(0deg) scale(1.05);
    }

    75% {
        transform: translateY(-6px) rotate(-1deg) scale(1.02);
    }
}

/* 装饰闪烁动画 */
@keyframes sparkle {

    0%,
    100% {
        opacity: 0.6;
        transform: scale(1) rotate(0deg);
    }

    50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
    }
}

/* 背景浮动动画 */
@keyframes backgroundFloat {

    0%,
    100% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }
}

/* 移动端适配 */
@media (max-width: 1280px) {
    .function-panel {
        position: static;
        margin-top: 20px;
    }

    .main-content-section {
        padding: 20px 0;
    }
}

@media (max-width: 960px) {

    .fruit-image-section,
    .fruit-emoji-display {
        height: 250px;
    }

    .fruit-emoji {
        font-size: 3rem;
        margin-bottom: 12px;
    }

    .fruit-name-text {
        font-size: 1.3rem;
        margin-bottom: 8px;
    }

    .info-cards-row .v-card {
        height: 50px;
    }

    .action-title {
        font-size: 0.7rem;
    }
}

@media (max-width: 600px) {
    .home-content {
        margin-top: 56px;
    }

    .main-content-section {
        padding: 16px 0;
    }

    .fruit-image-section,
    .fruit-emoji-display {
        height: 200px;
    }

    .fruit-emoji {
        font-size: 2.5rem;
        margin-bottom: 8px;
    }

    .fruit-name-text {
        font-size: 1.2rem;
        margin-bottom: 6px;
    }

    .decoration-dots {
        gap: 12px;
        font-size: 1rem;
    }

    .status-icon {
        font-size: 1.2rem;
    }

    .status-value {
        font-size: 1rem;
    }

    .action-icon {
        font-size: 1.2rem;
    }

    .action-title {
        font-size: 0.65rem;
    }
}
</style>
