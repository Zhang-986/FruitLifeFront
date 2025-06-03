<template>
    <div class="products-view">
        <!-- 简化的页面头部 -->
        <v-card class="products-header" elevation="0" rounded="0">
            <v-card-title class="d-flex align-center text-white">
                <!-- 返回主页按钮 -->
                <v-btn icon color="white" @click="goHome" class="back-btn mr-3" size="large">
                    <v-icon size="28">mdi-arrow-left</v-icon>
                </v-btn>

                <div class="flex-grow-1 text-center">
                    <v-icon color="white" class="mr-3" size="large">mdi-storefront</v-icon>
                    <span class="text-h4 font-weight-bold">新鲜水果</span>
                </div>

                <!-- 占位元素保持标题居中 -->
                <div style="width: 56px;"></div>
            </v-card-title>
            <v-card-subtitle class="text-center text-white opacity-90">
                精选优质水果，健康生活从这里开始
            </v-card-subtitle>
        </v-card>

        <!-- 主要内容区域 -->
        <v-card class="content-card" elevation="8" rounded="xl">
            <v-card-text class="pa-8">
                <!-- 搜索工具栏 - 简化版 -->
                <div class="toolbar-section mb-6">
                    <v-row align="center">
                        <v-col cols="12" md="8">
                            <v-text-field v-model="searchKeyword" label="搜索水果" prepend-inner-icon="mdi-magnify"
                                variant="outlined" hide-details clearable @keyup.enter="searchFruits"
                                @click:clear="clearSearch" class="search-input" rounded="lg"
                                placeholder="输入水果名称进行搜索...">
                                <template v-slot:append>
                                    <v-btn color="primary" variant="flat" @click="searchFruits" class="search-btn">
                                        搜索
                                    </v-btn>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" class="text-md-right">
                            <v-btn color="success" variant="outlined" @click="refreshFruits" size="large">
                                <v-icon start>mdi-refresh</v-icon>
                                刷新
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>

                <!-- 水果列表 -->
                <div class="fruits-section">
                    <!-- 加载状态 -->
                    <div v-if="loading" class="text-center py-12">
                        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
                        <div class="text-h6 mt-4 text-grey">加载中...</div>
                    </div>

                    <!-- 空状态 -->
                    <div v-else-if="fruits.length === 0" class="text-center py-12">
                        <v-icon color="grey-lighten-2" size="120">mdi-fruit-grapes-outline</v-icon>
                        <div class="text-h5 mt-4 text-grey">
                            {{ searchKeyword ? '没有找到相关水果' : '暂无水果' }}
                        </div>
                        <div class="text-body-1 mt-2 text-grey">
                            {{ searchKeyword ? '试试其他关键词' : '敬请期待更多水果上架' }}
                        </div>
                        <v-btn v-if="searchKeyword" color="primary" variant="outlined" @click="clearSearch"
                            class="mt-4">
                            <v-icon start>mdi-refresh</v-icon>
                            查看全部水果
                        </v-btn>
                    </div>

                    <!-- 水果网格 -->
                    <div v-else class="fruits-grid-container">
                        <v-row>
                            <v-col v-for="fruit in fruits" :key="fruit.id" cols="12" sm="6" md="4" lg="3">
                                <v-card class="fruit-product-card" elevation="4" rounded="xl" hover
                                    @click="viewFruitDetail(fruit)">
                                    <!-- 水果图片 -->
                                    <div class="fruit-image-section">
                                        <v-img v-if="fruit.imageUrl" :src="fruit.imageUrl" :alt="fruit.name"
                                            height="200" cover class="fruit-image" />
                                        <div v-else class="fruit-placeholder">
                                            <v-icon size="80" color="grey-lighten-2">mdi-image-off</v-icon>
                                            <div class="text-caption text-grey mt-2">暂无图片</div>
                                        </div>

                                        <!-- 季节标签 -->
                                        <v-chip v-if="fruit.seasonInfo" class="season-badge" color="orange" size="small"
                                            variant="elevated">
                                            {{ fruit.seasonInfo }}
                                        </v-chip>
                                    </div>

                                    <!-- 水果信息 -->
                                    <v-card-text class="pa-4">
                                        <h3 class="fruit-title mb-2">{{ fruit.name }}</h3>
                                        <p class="fruit-description text-body-2 text-grey-darken-1 mb-3">
                                            {{ fruit.description || '新鲜美味的水果' }}
                                        </p>

                                        <!-- 快速信息 -->
                                        <div class="fruit-features mb-3">
                                            <v-chip v-if="fruit.flavorProfile" color="pink" size="small" variant="tonal"
                                                class="mr-2 mb-1">
                                                <v-icon start size="12">mdi-emoticon-tongue</v-icon>
                                                {{ fruit.flavorProfile }}
                                            </v-chip>
                                        </div>

                                        <!-- 营养信息 -->
                                        <div v-if="fruit.nutritionSummary" class="nutrition-info mb-3">
                                            <div class="d-flex align-center mb-1">
                                                <v-icon color="success" size="small" class="mr-1">mdi-nutrition</v-icon>
                                                <span class="text-caption text-success font-weight-medium">营养价值</span>
                                            </div>
                                            <p class="text-caption text-grey nutrition-text">
                                                {{ truncateText(fruit.nutritionSummary, 50) }}
                                            </p>
                                        </div>

                                        <!-- 生活属性标签 -->
                                        <div v-if="getLifePropertiesArray(fruit).length" class="life-properties mb-3">
                                            <div class="d-flex flex-wrap gap-1">
                                                <v-chip v-for="property in getLifePropertiesArray(fruit).slice(0, 2)"
                                                    :key="property" color="primary" size="x-small" variant="tonal">
                                                    {{ property }}
                                                </v-chip>
                                                <v-chip v-if="getLifePropertiesArray(fruit).length > 2" color="grey"
                                                    size="x-small" variant="tonal">
                                                    +{{ getLifePropertiesArray(fruit).length - 2 }}
                                                </v-chip>
                                            </div>
                                        </div>
                                    </v-card-text>

                                    <!-- 操作按钮 -->
                                    <v-card-actions class="pa-4 pt-0">
                                        <v-btn color="primary" variant="text" size="small"
                                            @click.stop="viewFruitDetail(fruit)">
                                            <v-icon start size="small">mdi-eye</v-icon>
                                            查看详情
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- 分页控件 -->
                    <div v-if="fruits.length > 0" class="pagination-section mt-8">
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="6" class="text-center text-md-left">
                                <div class="text-body-2 text-grey">
                                    显示第 {{ pageInfo.pageNum }} 页，共 {{ pageInfo.total }} 种水果
                                    (第 {{ (pageInfo.pageNum - 1) * pageInfo.pageSize + 1 }}-{{
                                        Math.min(pageInfo.pageNum * pageInfo.pageSize, pageInfo.total)
                                    }} 种)
                                </div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="d-flex align-center justify-center justify-md-end">
                                    <v-select v-model="pagination.pageSize" :items="pageSizeOptions" label="每页显示"
                                        variant="outlined" hide-details density="compact" class="page-size-select mr-4"
                                        @update:model-value="handlePageSizeChange"></v-select>

                                    <v-pagination v-model="pagination.page" :length="pageInfo.pages" :total-visible="5"
                                        color="primary" @update:model-value="handlePageChange"
                                        class="pagination-control"></v-pagination>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- 水果详情对话框 -->
        <FruitDetailDialog v-model="showDetailDialog" :fruit="currentFruit" />

        <!-- 提示信息 -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFruits, getFruitByName, type Fruit, type PageRequestDTO, type PageInfo } from '@/api/fruit'
import FruitDetailDialog from '@/components/FruitDetailDialog.vue'

// 获取路由信息
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const fruits = ref<Fruit[]>([])
const searchKeyword = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 分页相关数据
const pagination = ref({
    page: 1,
    pageSize: 12
})

const pageInfo = ref<PageInfo<Fruit>>({
    pageNum: 1,
    pageSize: 12,
    total: 0,
    pages: 0,
    list: [],
    hasNextPage: false,
    hasPreviousPage: false
})

const pageSizeOptions = ref([8, 12, 16, 24])

// 弹窗相关数据
const showDetailDialog = ref(false)
const currentFruit = ref<Fruit | null>(null)

// 方法
const loadFruits = async () => {
    loading.value = true
    try {
        // 如果有搜索关键词，先尝试精确匹配
        if (searchKeyword.value && searchKeyword.value.trim()) {
            await searchByExactName()
            return
        }

        // 没有搜索关键词时使用分页查询
        const params: PageRequestDTO = {
            pageNum: pagination.value.page,
            pageSize: pagination.value.pageSize
        }

        console.log('🔍 发送水果分页查询请求:', params)

        const response = await getFruits(params)
        if (response.code === 200 && response.data) {
            fruits.value = response.data.list || []
            pageInfo.value = response.data
            console.log('✅ 获取水果数据成功:', response.data)
        } else {
            console.error('❌ 获取水果数据失败:', response)
            showMessage('获取水果数据失败', 'error')
        }
    } catch (error) {
        console.error('❌ 加载水果列表失败:', error)
        showMessage('加载水果列表失败', 'error')
    } finally {
        loading.value = false
    }
}

// 新增：根据精确名称搜索
const searchByExactName = async () => {
    const searchName = searchKeyword.value.trim()
    console.log('🎯 尝试精确匹配搜索:', searchName)

    try {
        const response = await getFruitByName(searchName)

        if (response.code === 200 && response.data) {
            // 找到精确匹配的水果
            fruits.value = [response.data]
            pageInfo.value = {
                pageNum: 1,
                pageSize: 1,
                total: 1,
                pages: 1,
                list: [response.data],
                hasNextPage: false,
                hasPreviousPage: false
            }
            console.log('✅ 精确匹配找到水果:', response.data)
            showMessage(`找到水果：${response.data.name}`, 'success')
        } else {
            // 精确匹配没找到，降级使用模糊查询
            console.log('🔄 精确匹配未找到，尝试模糊查询')
            await searchByKeyword()
        }
    } catch (error) {
        console.error('❌ 精确搜索失败，尝试模糊查询:', error)
        // 精确搜索失败，降级使用模糊查询
        await searchByKeyword()
    }
}

// 新增：模糊查询（使用原有的分页接口）
const searchByKeyword = async () => {
    const params: PageRequestDTO = {
        pageNum: pagination.value.page,
        pageSize: pagination.value.pageSize,
        keyword: searchKeyword.value.trim()
    }

    console.log('🔍 发送模糊查询请求:', params)

    try {
        const response = await getFruits(params)
        if (response.code === 200 && response.data) {
            fruits.value = response.data.list || []
            pageInfo.value = response.data
            console.log('✅ 模糊查询成功:', response.data)

            if (fruits.value.length === 0) {
                showMessage('没有找到相关水果', 'warning')
            } else {
                showMessage(`找到 ${fruits.value.length} 种相关水果`, 'success')
            }
        } else {
            console.error('❌ 模糊查询失败:', response)
            showMessage('搜索失败', 'error')
            fruits.value = []
            pageInfo.value = {
                pageNum: 1,
                pageSize: pagination.value.pageSize,
                total: 0,
                pages: 0,
                list: [],
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
    } catch (error) {
        console.error('❌ 模糊查询异常:', error)
        showMessage('搜索出现异常', 'error')
        fruits.value = []
        pageInfo.value = {
            pageNum: 1,
            pageSize: pagination.value.pageSize,
            total: 0,
            pages: 0,
            list: [],
            hasNextPage: false,
            hasPreviousPage: false
        }
    }
}

// 生活属性解析方法（复用）
const getLifePropertiesArray = (fruit: Fruit): string[] => {
    if (!fruit.lifeProperties) {
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
        console.error('解析生活属性失败:', error, fruit.lifeProperties)
        return []
    }
}

// 文本截断方法
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

const viewFruitDetail = (fruit: Fruit) => {
    console.log('🔍 查看水果详情:', fruit)
    currentFruit.value = fruit
    showDetailDialog.value = true
}

const addToCart = (fruit: Fruit) => {
    console.log('🛒 加入购物车:', fruit.name)
    showMessage(`${fruit.name} 已加入购物车`, 'success')
    // TODO: 实现加入购物车功能
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const searchFruits = () => {
    console.log('🔍 执行搜索:', searchKeyword.value)
    pagination.value.page = 1 // 搜索时重置到第一页
    loadFruits()
}

const clearSearch = () => {
    console.log('🔄 清除搜索')
    searchKeyword.value = ''
    pagination.value.page = 1
    loadFruits()
}

const refreshFruits = () => {
    console.log('🔄 刷新水果列表')
    loadFruits()
}

const handlePageChange = (page: number) => {
    console.log('📄 切换页面:', page)
    pagination.value.page = page
    loadFruits()
}

const handlePageSizeChange = (newSize: number) => {
    console.log('📄 改变页面大小:', newSize)
    pagination.value.pageSize = newSize
    pagination.value.page = 1
    loadFruits()
}

// 返回主页方法
const goHome = () => {
    console.log('🏠 返回主页')
    router.push('/')
}

// 初始化时检查URL参数
const initializeFromRoute = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('q')

    if (searchParam) {
        searchKeyword.value = decodeURIComponent(searchParam)
        console.log('🔍 从URL获取搜索参数:', searchKeyword.value)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    console.log('🚀 ProductsView 组件挂载')
    initializeFromRoute()
    loadFruits()
})
</script>

<style scoped>
.content-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin: 20px;
}

.products-header {
    background: linear-gradient(135deg, #1aac48 0%, #349065 100%);
    color: white;
    border-radius: 24px 24px 0 0;
    margin: 20px 20px 0 20px;
}

/* 返回按钮样式 */
.back-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: translateX(-2px);
}

.back-btn:active {
    transform: translateX(-4px) scale(0.95);
}

.fruit-product-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
    cursor: pointer;
    height: 100%;
    /* 确保卡片高度一致 */
}

.fruit-product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 152, 0, 0.3);
}

.fruit-image-section {
    position: relative;
    overflow: hidden;
}

.season-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
}

.fruit-placeholder {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}

.fruit-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #FF9800;
}

.fruit-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.nutrition-info {
    background: rgba(76, 175, 80, 0.05);
    border-radius: 8px;
    padding: 8px;
}

.nutrition-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}

.search-input {
    max-width: 100%;
}

.page-size-select {
    max-width: 120px;
}

.pagination-control {
    flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .products-view {
        padding-top: 60px;
    }

    .content-card {
        margin: 10px;
    }

    .products-header {
        margin: 10px 10px 0 10px;
    }

    .fruit-product-card {
        margin-bottom: 16px;
    }

    .pagination-section .v-row {
        flex-direction: column-reverse;
    }
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fruits-grid-container {
    animation: fadeIn 0.5s ease-out;
}

/* 确保卡片内容区域占满 */
.fruit-product-card .v-card-text {
    flex: 1;
}

/* 修复按钮对齐 */
.fruit-product-card .v-card-actions {
    margin-top: auto;
}
</style>
