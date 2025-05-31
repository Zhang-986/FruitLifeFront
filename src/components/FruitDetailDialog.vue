<template>
    <v-dialog v-model="showDialog" max-width="800" scrollable>
        <v-card class="fruit-detail-card" elevation="12" rounded="xl">
            <!-- 弹窗头部 -->
            <div class="detail-header fruit-gradient">
                <v-card-title class="text-white d-flex align-center">
                    <v-icon color="white" class="mr-3" size="large">mdi-information</v-icon>
                    <span class="text-h5 font-weight-bold">水果详情</span>
                    <v-spacer></v-spacer>
                    <v-btn icon variant="text" @click="showDialog = false" class="close-btn">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
            </div>

            <!-- 内容区域 -->
            <v-card-text class="pa-0" style="max-height: 700px;" v-if="fruit">
                

                <!-- 水果图片和基本信息 -->
                <div class="fruit-basic-section pa-6">
                    <v-row>
                        <v-col cols="12" md="4">
                            <div class="fruit-image-container">
                                <v-img v-if="fruit.imageUrl" :src="fruit.imageUrl" :alt="fruit.name" height="200" cover
                                    rounded="lg" class="fruit-image" />
                                <div v-else class="fruit-placeholder">
                                    <v-icon size="80" color="grey-lighten-2">mdi-image-off</v-icon>
                                    <div class="text-caption text-grey mt-2">暂无图片</div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="8">
                            <h2 class="fruit-title mb-3">{{ fruit.name }}</h2>
                            <p class="fruit-description mb-3">{{ fruit.description || '暂无描述' }}</p>

                            <!-- 快速信息标签 -->
                            <div class="quick-info mb-3">
                                <v-chip v-if="fruit.flavorProfile" color="pink" variant="tonal" class="mr-2 mb-2">
                                    <v-icon start size="small">mdi-emoticon-tongue</v-icon>
                                    {{ fruit.flavorProfile }}
                                </v-chip>
                                <v-chip v-if="fruit.seasonInfo" color="orange" variant="tonal" class="mr-2 mb-2">
                                    <v-icon start size="small">mdi-calendar</v-icon>
                                    {{ fruit.seasonInfo }}
                                </v-chip>
                            </div>

                            <!-- 营养概览 -->
                            <div v-if="fruit.nutritionSummary" class="nutrition-section">
                                <h4 class="section-title mb-2">
                                    <v-icon color="success" class="mr-2">mdi-nutrition</v-icon>
                                    营养价值
                                </h4>
                                <p class="section-content">{{ fruit.nutritionSummary }}</p>
                            </div>
                        </v-col>
                    </v-row>
                </div>

                <v-divider></v-divider>

                <!-- 生活属性标签 -->
                <div v-if="getLifePropertiesArray(fruit).length" class="life-properties-section pa-6">
                    <h4 class="section-title mb-3">
                        <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
                        生活属性
                    </h4>
                    <div class="d-flex flex-wrap gap-2">
                        <v-chip v-for="property in getLifePropertiesArray(fruit)" :key="property" color="primary"
                            variant="tonal" size="small">
                            {{ property }}
                        </v-chip>
                    </div>
                </div>

                <v-divider v-if="getLifePropertiesArray(fruit).length"></v-divider>

                <!-- 详细信息 -->
                <div class="detail-sections pa-6">
                    <v-row>
                        <!-- 挑选技巧 -->
                        <v-col cols="12" md="6" v-if="fruit.selectionTips">
                            <div class="info-section">
                                <h4 class="section-title mb-2">
                                    <v-icon color="info" class="mr-2">mdi-eye-check</v-icon>
                                    挑选技巧
                                </h4>
                                <p class="section-content">{{ fruit.selectionTips }}</p>
                            </div>
                        </v-col>

                        <!-- 储存方法 -->
                        <v-col cols="12" md="6" v-if="fruit.storageTips">
                            <div class="info-section">
                                <h4 class="section-title mb-2">
                                    <v-icon color="blue" class="mr-2">mdi-fridge</v-icon>
                                    储存方法
                                </h4>
                                <p class="section-content">{{ fruit.storageTips }}</p>
                            </div>
                        </v-col>

                        <!-- 食用禁忌 - 新增展示 -->
                        <v-col cols="12" md="6" v-if="fruit.eatingTaboos">
                            <div class="info-section warning-section">
                                <h4 class="section-title mb-2">
                                    <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
                                    食用禁忌
                                </h4>
                                <p class="section-content">{{ fruit.eatingTaboos }}</p>
                            </div>
                        </v-col>

                        <!-- 文化寓意 - 新增展示 -->
                        <v-col cols="12" md="6" v-if="fruit.culturalSignificance">
                            <div class="info-section cultural-section">
                                <h4 class="section-title mb-2">
                                    <v-icon color="purple" class="mr-2">mdi-account-group</v-icon>
                                    文化寓意
                                </h4>
                                <p class="section-content">{{ fruit.culturalSignificance }}</p>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>

            <!-- 无数据提示 -->
            <v-card-text v-else class="pa-6 text-center">
                <v-icon size="64" color="grey-lighten-2">mdi-alert-circle</v-icon>
                <div class="text-h6 mt-4 text-grey">暂无水果数据</div>
            </v-card-text>

            <!-- 底部操作 -->
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="showDialog = false">
                    <v-icon start>mdi-check</v-icon>
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { type Fruit } from '@/api/fruit'

// Props
interface Props {
    modelValue: boolean
    fruit?: Fruit | null
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    fruit: null
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

// 响应式数据
const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// 开发环境判断
const isDev = computed(() => import.meta.env.DEV)

// 调试信息
watch(() => props.fruit, (newFruit) => {
    if (isDev.value) {
        console.log('🔍 FruitDetailDialog 接收到水果数据:', newFruit)
    }
}, { immediate: true })

watch(showDialog, (newValue) => {
    if (isDev.value) {
        console.log('🔍 FruitDetailDialog 对话框状态:', newValue ? '打开' : '关闭')
    }
})

const getLifePropertiesArray = (fruit: Fruit | null): string[] => {
    if (!fruit?.lifeProperties) {
        return []
    }

    try {
        // 如果已经是数组，直接返回
        if (Array.isArray(fruit.lifeProperties)) {
            return fruit.lifeProperties
        }

        // 如果是字符串，尝试解析JSON
        if (typeof fruit.lifeProperties === 'string') {
            const parsed = JSON.parse(fruit.lifeProperties)
            return Array.isArray(parsed) ? parsed : []
        }

        return []
    } catch (error) {
        console.error('解析生活属性失败:', error, fruit.lifeProperties)
        return []
    }
}
</script>

<style scoped>
.fruit-detail-card {
    background: rgba(255, 255, 255, 0.98) !important;
}

.detail-header {
    border-radius: 24px 24px 0 0;
}

.fruit-gradient {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.close-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px);
}

.fruit-image-container {
    width: 100%;
    height: 200px;
}

.fruit-placeholder {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px;
}

.fruit-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2E7D32;
}

.fruit-description {
    font-size: 1rem;
    line-height: 1.5;
    color: #555;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
}

.section-content {
    font-size: 0.95rem;
    line-height: 1.5;
    color: #666;
    margin: 0;
}

.info-section {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
}

.quick-info .v-chip {
    margin-right: 8px;
    margin-bottom: 8px;
}

/* 新增样式 - 为不同类型的信息区块添加不同的边框颜色 */
.warning-section {
    border-left-color: #FF9800 !important;
    background: rgba(255, 152, 0, 0.05) !important;
}

.cultural-section {
    border-left-color: #9C27B0 !important;
    background: rgba(156, 39, 176, 0.05) !important;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .fruit-detail-card {
        margin: 16px;
    }

    .fruit-title {
        font-size: 1.5rem;
    }
}
</style>
