<script setup lang="ts">
import { ref } from 'vue'

const featuredFruits = ref([
    {
        id: 1,
        name: '新鲜苹果',
        price: 12.99,
        image: '🍎',
        description: '甜脆可口，营养丰富',
        color: 'success'
    },
    {
        id: 2,
        name: '香甜橙子',
        price: 8.99,
        image: '🍊',
        description: '维C丰富，酸甜适中',
        color: 'warning'
    },
    {
        id: 3,
        name: '鲜美草莓',
        price: 15.99,
        image: '🍓',
        description: '酸甜可口，颜值超高',
        color: 'error'
    },
    {
        id: 4,
        name: '热带芒果',
        price: 18.99,
        image: '🥭',
        description: '香甜浓郁，口感顺滑',
        color: 'banana'
    }
])

const categories = ref([
    { name: '新鲜水果', icon: 'mdi-fruit-cherries', color: 'primary' },
    { name: '有机蔬菜', icon: 'mdi-carrot', color: 'success' },
    { name: '坚果干果', icon: 'mdi-peanut', color: 'brown' },
    { name: '进口水果', icon: 'mdi-airplane', color: 'info' }
])
</script>

<template>
    <div>
        <!-- 欢迎横幅 -->
        <v-row class="mb-12">
            <v-col cols="12">
                <v-card class="welcome-banner fruit-gradient-orange" elevation="12" rounded="xl">
                    <div class="welcome-content">
                        <div class="welcome-icons mb-8">
                            🍎🍊🍓🥭🍇
                        </div>

                        <v-card-title class="welcome-title bounce-in">
                            欢迎来到水果生活
                        </v-card-title>

                        <v-card-subtitle class="welcome-subtitle">
                            新鲜水果，健康生活每一天
                        </v-card-subtitle>

                        <p class="welcome-description">
                            精选全球优质水果，严格品质把控，冷链运输保鲜<br>
                            让每一口都是大自然的美好馈赠
                        </p>

                        <div class="welcome-actions">
                            <v-btn color="white" variant="elevated" size="x-large" class="action-btn primary-btn"
                                rounded="xl">
                                <v-icon start size="large">mdi-shopping</v-icon>
                                开始购买
                            </v-btn>

                            <v-btn color="white" variant="outlined" size="x-large" class="action-btn secondary-btn ml-6"
                                rounded="xl">
                                <v-icon start size="large">mdi-information</v-icon>
                                了解更多
                            </v-btn>
                        </div>

                        <div class="welcome-features">
                            <div class="feature-item">
                                <v-icon color="white" size="large">mdi-truck-fast</v-icon>
                                <span>2小时送达</span>
                            </div>
                            <div class="feature-item">
                                <v-icon color="white" size="large">mdi-leaf</v-icon>
                                <span>新鲜保证</span>
                            </div>
                            <div class="feature-item">
                                <v-icon color="white" size="large">mdi-certificate</v-icon>
                                <span>品质认证</span>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- 分类卡片 -->
        <v-row class="mb-8">
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold text-center mb-6">🍇 精选分类</h2>
            </v-col>
            <v-col v-for="category in categories" :key="category.name" cols="12" sm="6" md="3">
                <v-card class="fruit-card text-center pa-4" :color="category.color" variant="tonal" hover>
                    <v-icon size="48" class="mb-3">{{ category.icon }}</v-icon>
                    <v-card-title class="text-h6">{{ category.name }}</v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <!-- 特色水果展示 -->
        <v-row>
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold text-center mb-6">🌟 今日特价</h2>
            </v-col>
            <v-col v-for="fruit in featuredFruits" :key="fruit.id" cols="12" sm="6" md="3">
                <v-card class="fruit-card" height="320">
                    <div class="text-center pa-4">
                        <div class="text-h1 mb-3">{{ fruit.image }}</div>
                        <v-card-title class="text-h6 font-weight-bold">
                            {{ fruit.name }}
                        </v-card-title>
                        <v-card-subtitle class="mb-3">
                            {{ fruit.description }}
                        </v-card-subtitle>
                        <div class="text-h5 font-weight-bold mb-4" :class="`text-${fruit.color}`">
                            ¥{{ fruit.price }}
                        </div>
                    </div>

                    <v-card-actions class="pa-4">
                        <v-btn :color="fruit.color" variant="elevated" block size="large" rounded>
                            <v-icon start>mdi-cart-plus</v-icon>
                            加入购物车
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- 促销横幅 -->
        <v-row class="mt-8">
            <v-col cols="12">
                <v-card class="fruit-gradient-pink pa-8 text-center" elevation="8">
                    <v-card-title class="text-h3 text-white font-weight-bold mb-4">
                        🎉 限时优惠
                    </v-card-title>
                    <v-card-subtitle class="text-h6 text-white opacity-90 mb-4">
                        全场水果满99元免费配送，新用户首单立减20元！
                    </v-card-subtitle>
                    <v-btn color="white" variant="elevated" size="x-large" class="font-weight-bold" rounded>
                        立即抢购
                        <v-icon end>mdi-flash</v-icon>
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.v-card {
    transition: all 0.3s ease;
}

.v-card:hover {
    transform: translateY(-2px);
}

/* 欢迎横幅样式 */
.welcome-banner {
    position: relative;
    overflow: hidden;
}

.welcome-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 152, 0, 0.9) 0%,
            rgba(255, 183, 77, 0.8) 50%,
            rgba(255, 206, 119, 0.9) 100%);
    z-index: 1;
}

.welcome-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 80px 60px;
    max-width: 900px;
    margin: 0 auto;
}

.welcome-icons {
    font-size: 3.5rem;
    line-height: 1;
    opacity: 0.9;
}

.welcome-title {
    font-size: 3.5rem !important;
    font-weight: 800 !important;
    color: white !important;
    line-height: 1.2 !important;
    margin-bottom: 24px !important;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
    font-size: 1.5rem !important;
    color: white !important;
    opacity: 0.95 !important;
    font-weight: 500 !important;
    margin-bottom: 32px !important;
    line-height: 1.4 !important;
}

.welcome-description {
    font-size: 1.1rem;
    color: white;
    opacity: 0.9;
    line-height: 1.8;
    margin: 0 0 48px 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.welcome-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 24px;
}

.action-btn {
    font-size: 18px !important;
    font-weight: 600 !important;
    min-height: 64px !important;
    padding: 0 32px !important;
    letter-spacing: 0.5px !important;
    transition: all 0.3s ease !important;
}

.primary-btn {
    background: rgba(255, 255, 255, 0.95) !important;
    color: #FF9800 !important;
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3) !important;
}

.primary-btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.4) !important;
    background: white !important;
}

.secondary-btn {
    border: 2px solid white !important;
    color: white !important;
}

.secondary-btn:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-3px) !important;
}

.welcome-features {
    display: flex;
    justify-content: center;
    gap: 48px;
    flex-wrap: wrap;
}

.feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: white;
    opacity: 0.9;
}

.feature-item span {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

/* 动画效果 */
@keyframes bounce-in {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }

    50% {
        transform: scale(1.05);
    }

    70% {
        transform: scale(0.9);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.bounce-in {
    animation: bounce-in 0.8s ease-out;
}

/* 响应式调整 */
@media (max-width: 1200px) {
    .welcome-content {
        padding: 60px 40px;
    }

    .welcome-actions {
        flex-direction: column;
        gap: 16px;
    }

    .action-btn {
        width: 280px;
    }

    .welcome-features {
        gap: 32px;
    }
}
</style>
