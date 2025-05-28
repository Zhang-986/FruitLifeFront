<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/AppNavigation.vue'

const router = useRouter()

// 轮播图数据
const carouselSlides = ref([
    {
        title: '新鲜水果 每日送达',
        subtitle: '精选优质水果，新鲜直达您的餐桌',
        buttonText: '立即选购',
        image: 'https://picsum.photos/800/300?random=1',
        action: () => router.push('/products')
    },
    {
        title: '特价促销 限时优惠',
        subtitle: '多种水果特价销售，错过再等一年',
        buttonText: '查看促销',
        image: 'https://picsum.photos/800/300?random=2',
        action: () => router.push('/promotions')
    },
    {
        title: '会员专享 更多优惠',
        subtitle: '注册会员享受更多专属优惠',
        buttonText: '立即注册',
        image: 'https://picsum.photos/800/300?random=3',
        action: () => router.push('/register')
    }
])

// 热门商品
const featuredProducts = ref([
    {
        id: 1,
        name: '新鲜苹果',
        description: '脆甜可口，营养丰富',
        price: '12.80',
        image: 'https://picsum.photos/300/200?random=10'
    },
    {
        id: 2,
        name: '香甜橙子',
        description: '汁多味甜，维C丰富',
        price: '15.60',
        image: 'https://picsum.photos/300/200?random=11'
    },
    {
        id: 3,
        name: '进口香蕉',
        description: '软糯香甜，老少皆宜',
        price: '8.90',
        image: 'https://picsum.photos/300/200?random=12'
    },
    {
        id: 4,
        name: '新鲜草莓',
        description: '酸甜可口，颜值很高',
        price: '28.80',
        image: 'https://picsum.photos/300/200?random=13'
    }
])

// 方法
const viewProduct = (product: any) => {
    console.log('查看商品:', product.name)
    // 这里可以跳转到商品详情页面
}

const addToCart = (product: any) => {
    console.log('添加到购物车:', product.name)
    // 这里可以调用添加购物车的API
}
</script>

<template>
    <div class="home-page">
        <!-- 使用统一的导航组件 -->
        <AppNavigation :show-search-button="true" :show-cart-button="true" />

        <!-- 主要内容区域 -->
        <div class="home-content">
            <!-- 轮播图 -->
            <v-carousel cycle height="300" hide-delimiter-background show-arrows="hover" class="home-carousel">
                <v-carousel-item v-for="(slide, i) in carouselSlides" :key="i" :src="slide.image" cover>
                    <div class="carousel-content">
                        <div class="text-center">
                            <h2 class="text-h3 font-weight-bold text-white mb-4">
                                {{ slide.title }}
                            </h2>
                            <p class="text-h6 text-white mb-6">
                                {{ slide.subtitle }}
                            </p>
                            <v-btn color="white" variant="elevated" size="large" rounded="xl" @click="slide.action">
                                {{ slide.buttonText }}
                            </v-btn>
                        </div>
                    </div>
                </v-carousel-item>
            </v-carousel>

            <!-- 商品展示区域 -->
            <v-container class="py-8">
                <!-- 热门商品 -->
                <section class="mb-8">
                    <h2 class="text-h4 font-weight-bold text-center mb-6">
                        🔥 热门水果
                    </h2>
                    <v-row>
                        <v-col v-for="product in featuredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
                            <v-card class="product-card" elevation="4" rounded="xl" hover @click="viewProduct(product)">
                                <v-img :src="product.image" height="200" cover class="product-image">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                                <v-card-text class="pa-4">
                                    <h3 class="text-h6 font-weight-bold mb-2">{{ product.name }}</h3>
                                    <p class="text-body-2 text-medium-emphasis mb-3">{{ product.description }}</p>
                                    <div class="d-flex align-center justify-space-between">
                                        <span class="text-h6 font-weight-bold text-primary">
                                            ¥{{ product.price }}
                                        </span>
                                        <v-btn color="primary" variant="elevated" size="small" rounded="xl"
                                            @click.stop="addToCart(product)">
                                            <v-icon start>mdi-cart-plus</v-icon>
                                            加入购物车
                                        </v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </section>
            </v-container>
        </div>
    </div>
</template>

<style scoped>
.home-page {
    position: relative;
    min-height: 100vh;
}

.home-content {
    margin-top: 64px;
    /* 为固定导航栏留出空间 */
}

.home-carousel {
    margin-top: 0;
}

.carousel-content {
    height: 100%;
    background: linear-gradient(45deg,
            rgba(76, 175, 80, 0.8) 0%,
            rgba(139, 195, 74, 0.8) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-card {
    transition: all 0.3s ease;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.product-image {
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

/* 移动端适配 */
@media (max-width: 600px) {
    .home-content {
        margin-top: 56px;
    }

    .carousel-content h2 {
        font-size: 1.5rem !important;
    }

    .carousel-content p {
        font-size: 1rem !important;
    }
}
</style>
