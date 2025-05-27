<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
    {
        icon: 'mdi-leaf',
        title: '新鲜保证',
        description: '所有水果当日采摘，保证新鲜度',
        color: 'success'
    },
    {
        icon: 'mdi-truck-fast',
        title: '极速配送',
        description: '市区内2小时送达，冷链运输',
        color: 'info'
    },
    {
        icon: 'mdi-certificate',
        title: '品质认证',
        description: '通过有机认证，安全无农药残留',
        color: 'warning'
    },
    {
        icon: 'mdi-heart',
        title: '用心服务',
        description: '7x24小时客服，满意度100%',
        color: 'error'
    }
])

const team = ref([
    {
        name: '张小果',
        role: '创始人 & CEO',
        avatar: '👨‍💼',
        description: '致力于为用户提供最优质的水果体验'
    },
    {
        name: '李小鲜',
        role: '采购总监',
        avatar: '👩‍🌾',
        description: '严选全球优质水果，确保品质第一'
    },
    {
        name: '王小送',
        role: '配送经理',
        avatar: '🚚',
        description: '专业冷链配送，保证水果新鲜到家'
    }
])
</script>

<template>
    <div>
        <!-- 公司介绍 -->
        <v-row class="mb-8">
            <v-col cols="12">
                <v-card class="fruit-gradient pa-8 text-center" elevation="8">
                    <v-card-title class="text-h2 text-white font-weight-bold mb-4">
                        🍎 关于水果生活
                    </v-card-title>
                    <v-card-subtitle class="text-h5 text-white opacity-90 mb-6">
                        让每一口都是大自然的美好
                    </v-card-subtitle>
                    <p class="text-body-1 text-white opacity-90 max-width-800 mx-auto">
                        水果生活成立于2020年，专注于为用户提供最新鲜、最优质的水果。
                        我们与全国各地的优质果园直接合作，从源头把控品质，
                        通过先进的冷链配送技术，确保每一颗水果都能以最佳状态送到您的手中。
                    </p>
                </v-card>
            </v-col>
        </v-row>

        <!-- 核心特色 -->
        <v-row class="mb-8">
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold text-center mb-6">🌟 我们的优势</h2>
            </v-col>
            <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="3">
                <v-card class="fruit-card text-center pa-6" height="280">
                    <v-icon :color="feature.color" size="64" class="mb-4">
                        {{ feature.icon }}
                    </v-icon>
                    <v-card-title class="text-h6 font-weight-bold mb-3">
                        {{ feature.title }}
                    </v-card-title>
                    <v-card-text>
                        {{ feature.description }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 团队介绍 -->
        <v-row class="mb-8">
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold text-center mb-6">👥 核心团队</h2>
            </v-col>
            <v-col v-for="member in team" :key="member.name" cols="12" md="4">
                <v-card class="fruit-card text-center pa-6">
                    <div class="text-h1 mb-4">{{ member.avatar }}</div>
                    <v-card-title class="text-h5 font-weight-bold">
                        {{ member.name }}
                    </v-card-title>
                    <v-card-subtitle class="text-subtitle-1 font-weight-medium mb-3">
                        {{ member.role }}
                    </v-card-subtitle>
                    <v-card-text>
                        {{ member.description }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 联系方式 -->
        <v-row>
            <v-col cols="12">
                <v-card class="fruit-card pa-8">
                    <v-card-title class="text-h4 font-weight-bold text-center mb-6">
                        📞 联系我们
                    </v-card-title>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-list>
                                <v-list-item prepend-icon="mdi-phone" title="客服热线">
                                    <template v-slot:subtitle>
                                        400-123-4567 (7x24小时)
                                    </template>
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-email" title="邮箱地址">
                                    <template v-slot:subtitle>
                                        service@fruitlife.com
                                    </template>
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-map-marker" title="公司地址">
                                    <template v-slot:subtitle>
                                        北京市朝阳区水果大街123号
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-list>
                                <v-list-item prepend-icon="mdi-wechat" title="微信客服">
                                    <template v-slot:subtitle>
                                        FruitLife2020
                                    </template>
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-qqchat" title="QQ群">
                                    <template v-slot:subtitle>
                                        123456789
                                    </template>
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-clock" title="营业时间">
                                    <template v-slot:subtitle>
                                        24小时在线服务
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.max-width-800 {
    max-width: 800px;
}
</style>
