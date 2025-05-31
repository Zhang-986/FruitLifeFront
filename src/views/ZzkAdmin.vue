<template>
    <div class="admin-container">
        <!-- 管理员头部 -->
        <v-card class="admin-header" elevation="0" rounded="0">
            <v-card-title class="text-center text-white">
                <v-icon color="white" class="mr-3" size="large">mdi-shield-crown</v-icon>
                <span class="text-h4 font-weight-bold">水果管理后台</span>
            </v-card-title>
            <v-card-subtitle class="text-center text-white opacity-90">
                管理和维护水果信息数据库
            </v-card-subtitle>
        </v-card>

        <!-- 功能卡片区域 -->
        <v-card class="content-card" elevation="8" rounded="xl">
            <v-card-text class="pa-8">
                <!-- 操作工具栏 -->
                <div class="toolbar-section mb-6">
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="searchKeyword" label="搜索水果" prepend-inner-icon="mdi-magnify"
                                variant="outlined" hide-details clearable @keyup.enter="searchFruits"
                                @click:clear="clearSearch" class="search-input" rounded="lg">
                                <template v-slot:append>
                                    <v-btn color="primary" variant="flat" @click="searchFruits" class="search-btn">
                                        搜索
                                    </v-btn>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="text-md-right">
                            <v-btn color="primary" variant="elevated" @click="openAddDialog"
                                class="fruit-gradient-btn mr-3" size="large">
                                <v-icon start>mdi-plus</v-icon>
                                添加水果
                            </v-btn>
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
                        <div class="text-h5 mt-4 text-grey">暂无水果数据</div>
                        <div class="text-body-1 mt-2 text-grey">点击上方"添加水果"按钮开始添加</div>
                    </div>

                    <!-- 水果网格 -->
                    <div v-else class="fruits-list-container">
                        <v-row>
                            <v-col v-for="fruit in fruits" :key="fruit.id" cols="12" sm="6" md="4" lg="3">
                                <v-card class="fruit-card" elevation="4" rounded="xl" hover>
                                    <!-- 水果图片 -->
                                    <div class="fruit-image-section">
                                        <v-img v-if="fruit.imageUrl" :src="fruit.imageUrl" :alt="fruit.name"
                                            height="200" cover class="fruit-image" />
                                        <div v-else class="fruit-placeholder">
                                            <v-icon size="80" color="grey-lighten-2">mdi-image-off</v-icon>
                                            <div class="text-caption text-grey mt-2">暂无图片</div>
                                        </div>
                                    </div>

                                    <!-- 水果信息 -->
                                    <v-card-text class="pa-4">
                                        <h3 class="fruit-title mb-2">{{ fruit.name }}</h3>
                                        <p class="fruit-description text-body-2 text-grey-darken-1 mb-3">
                                            {{ fruit.description || '暂无描述' }}
                                        </p>

                                        <!-- 快速信息 -->
                                        <div class="fruit-tags mb-3">
                                            <v-chip v-if="fruit.seasonInfo" color="orange" size="small" variant="tonal"
                                                class="mr-2 mb-1">
                                                {{ fruit.seasonInfo }}
                                            </v-chip>
                                            <v-chip v-if="fruit.flavorProfile" color="pink" size="small" variant="tonal"
                                                class="mr-2 mb-1">
                                                {{ fruit.flavorProfile }}
                                            </v-chip>
                                        </div>

                                        <!-- 生活属性 - 修复显示逻辑 -->
                                        <div v-if="getLifePropertiesArray(fruit).length" class="life-properties mb-3">
                                            <div class="text-caption text-grey mb-1">生活属性:</div>
                                            <div class="d-flex flex-wrap gap-1">
                                                <v-chip v-for="property in getLifePropertiesArray(fruit).slice(0, 3)"
                                                    :key="property" color="primary" size="x-small" variant="tonal">
                                                    {{ property }}
                                                </v-chip>
                                                <v-chip v-if="getLifePropertiesArray(fruit).length > 3" color="grey"
                                                    size="x-small" variant="tonal">
                                                    +{{ getLifePropertiesArray(fruit).length - 3 }}
                                                </v-chip>
                                            </div>
                                        </div>
                                    </v-card-text>

                                    <!-- 操作按钮 -->
                                    <v-card-actions class="pa-4 pt-0">
                                        <v-btn color="info" variant="text" size="small" @click="viewFruit(fruit)">
                                            <v-icon start size="small">mdi-eye</v-icon>
                                            查看
                                        </v-btn>
                                        <v-btn color="primary" variant="text" size="small" @click="editFruit(fruit)">
                                            <v-icon start size="small">mdi-pencil</v-icon>
                                            编辑
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="text" size="small" @click="confirmDelete(fruit)">
                                            <v-icon start size="small">mdi-delete</v-icon>
                                            删除
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- 分页控件 -->
                    <div v-if="fruits.length > 0" class="pagination-section mt-6">
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="6" class="text-center text-md-left">
                                <div class="text-body-2 text-grey">
                                    显示第 {{ pageInfo.pageNum }} 页，共 {{ pageInfo.total }} 条记录
                                    (第 {{ (pageInfo.pageNum - 1) * pageInfo.pageSize + 1 }}-{{ Math.min(pageInfo.pageNum
                                        *
                                        pageInfo.pageSize, pageInfo.total) }} 条)
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

        <!-- 弹窗组件 -->
        <FruitEditDialog v-model="showEditDialog" :fruit="currentFruit" :is-edit="isEdit"
            @fruit-saved="handleFruitSaved" />

        <FruitDetailDialog v-model="showDetailDialog" :fruit="currentFruit" />

        <!-- 删除确认对话框 -->
        <v-dialog v-model="showDeleteDialog" max-width="400">
            <v-card>
                <v-card-title>确认删除</v-card-title>
                <v-card-text>
                    确定要删除水果"{{ currentFruit?.name }}"吗？此操作不可撤销。
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showDeleteDialog = false">取消</v-btn>
                    <v-btn color="error" @click="handleDelete" :loading="deleting">删除</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import { ref, onMounted, computed } from 'vue'
import { getFruits, deleteFruit, type Fruit, type PageRequestDTO, type PageInfo } from '@/api/fruit'
import FruitEditDialog from '@/components/FruitEditDialog.vue'
import FruitDetailDialog from '@/components/FruitDetailDialog.vue'

// 响应式数据
const loading = ref(false)
const deleting = ref(false)
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

const pageSizeOptions = ref([6, 12, 24, 48])

// 弹窗相关数据
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const currentFruit = ref<Fruit | null>(null)
const isEdit = ref(false)

// 方法
const loadFruits = async () => {
    loading.value = true
    try {
        const params: PageRequestDTO = {
            pageNum: pagination.value.page,
            pageSize: pagination.value.pageSize,
            ...(searchKeyword.value && { keyword: searchKeyword.value })
        }

        const response = await getFruits(params)
        if (response.code === 200 && response.data) {
            fruits.value = response.data.list || []
            pageInfo.value = response.data
        }
    } catch (error) {
        console.error('加载水果列表失败:', error)
        showMessage('加载水果列表失败', 'error')
    } finally {
        loading.value = false
    }
}

// 新增方法：将生活属性字符串转换为数组
const getLifePropertiesArray = (fruit: Fruit): string[] => {
    if (!fruit.lifeProperties) {
        return []
    }

    try {
        // 如果已经是数组，直接返回
        if (Array.isArray(fruit.lifeProperties)) {
            return fruit.lifeProperties
        }

        // 如果是字符串，尝试解析JSON
        if (typeof fruit.lifeProperties === 'string') {
            // 跳过空字符串
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

const openAddDialog = () => {
    currentFruit.value = null
    isEdit.value = false
    showEditDialog.value = true
}

const viewFruit = (fruit: Fruit) => {
    console.log('🔍 查看水果详情:', fruit)
    currentFruit.value = fruit
    showDetailDialog.value = true
}

const editFruit = (fruit: Fruit) => {
    console.log('✏️ 编辑水果:', fruit)
    currentFruit.value = fruit
    isEdit.value = true
    showEditDialog.value = true
}

const confirmDelete = (fruit: Fruit) => {
    console.log('🗑️ 确认删除水果:', fruit)
    currentFruit.value = fruit
    showDeleteDialog.value = true
}

const handleDelete = async () => {
    if (!currentFruit.value?.id || deleting.value) return

    deleting.value = true
    try {
        const response = await deleteFruit(currentFruit.value.id)
        if (response.code === 200) {
            showMessage('删除水果成功', 'success')
            showDeleteDialog.value = false
            await loadFruits()
        } else {
            showMessage(response.msg || '删除失败', 'error')
        }
    } catch (error) {
        console.error('删除水果失败:', error)
        showMessage('删除水果失败', 'error')
    } finally {
        deleting.value = false
    }
}

const handleFruitSaved = () => {
    showMessage(isEdit.value ? '更新水果成功' : '添加水果成功', 'success')
    loadFruits()
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const searchFruits = () => {
    pagination.value.page = 1
    loadFruits()
}

const clearSearch = () => {
    searchKeyword.value = ''
    pagination.value.page = 1
    loadFruits()
}

const refreshFruits = () => {
    loadFruits()
}

const handlePageChange = (page: number) => {
    pagination.value.page = page
    loadFruits()
}

const handlePageSizeChange = (newSize: number) => {
    pagination.value.pageSize = newSize
    pagination.value.page = 1
    loadFruits()
}

// 组件挂载时加载数据
onMounted(() => {
    loadFruits()
})
</script>

<style scoped>
.content-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-header {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
    border-radius: 24px 24px 0 0;
}

.fruit-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.fruit-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
}

.fruit-image-section {
    position: relative;
    overflow: hidden;
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
    font-size: 1.1rem;
    font-weight: 600;
    color: #2E7D32;
}

.fruit-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fruit-gradient-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
}

.search-input {
    max-width: 400px;
}

.page-size-select {
    max-width: 120px;
}

.pagination-control {
    flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .admin-container {
        padding-top: 60px;
    }

    .fruit-card {
        margin-bottom: 16px;
    }

    .pagination-section .v-row {
        flex-direction: column-reverse;
    }

    .pagination-section .v-col {
        text-align: center !important;
    }
}
</style>
