<template>
    <div class="fruit-management">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="d-flex align-center justify-center position-relative">
                <v-btn icon variant="text" color="primary" @click="goBack" class="back-button" title="返回上一页">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <h1 class="page-title">
                    <v-icon color="success" class="mr-3" size="large">mdi-fruit-cherries</v-icon>
                    水果管理系统
                </h1>
            </div>
            <p class="page-subtitle">管理平台上的所有水果信息</p>
        </div>

        <!-- 操作栏 -->
        <v-card class="action-bar mb-6" elevation="2" rounded="lg">
            <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center flex-wrap">
                    <!-- 搜索框 -->
                    <div class="search-section">
                        <v-text-field v-model="searchKeyword" prepend-inner-icon="mdi-magnify" label="搜索水果名称"
                            variant="outlined" density="compact" hide-details clearable style="min-width: 280px;"
                            @keyup.enter="handleSearch" @click:clear="clearSearch" />
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <v-btn color="primary" variant="elevated" @click="openAddDialog" class="mr-3">
                            <v-icon start>mdi-plus</v-icon>
                            添加水果
                        </v-btn>
                        <v-btn color="info" variant="outlined" @click="loadFruits" :loading="loading">
                            <v-icon start>mdi-refresh</v-icon>
                            刷新
                        </v-btn>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- 水果列表 -->
        <v-card elevation="4" rounded="lg">
            <v-card-title class="bg-primary text-white">
                <v-icon color="white" class="mr-2">mdi-format-list-bulleted</v-icon>
                水果列表
                <v-spacer></v-spacer>
                <v-chip color="white" text-color="primary" variant="elevated">
                    共 {{ pagination.total }} 个水果
                </v-chip>
            </v-card-title>

            <!-- 数据表格 -->
            <v-data-table :headers="headers" :items="fruits" :loading="loading" :items-per-page="pagination.pageSize"
                :page="pagination.pageNum" hide-default-footer class="fruit-table">
                <!-- 水果图片 -->
                <template v-slot:item.imageUrl="{ item }">
                    <div class="fruit-image-cell">
                        <v-img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" width="60" height="60" cover
                            rounded="lg" class="fruit-image">
                            <template v-slot:error>
                                <div class="error-placeholder">
                                    <v-icon size="24" color="grey">mdi-image-broken</v-icon>
                                </div>
                            </template>
                        </v-img>
                        <div v-else class="no-image-placeholder">
                            <v-icon size="24" color="grey">mdi-image-off</v-icon>
                        </div>
                    </div>
                </template>

                <!-- 水果名称 -->
                <template v-slot:item.name="{ item }">
                    <div class="fruit-name-cell">
                        <div class="fruit-name">{{ item.name }}</div>
                        <div class="fruit-description text-caption text-grey">
                            {{ item.description || '暂无描述' }}
                        </div>
                    </div>
                </template>

                <!-- 口味特征 -->
                <template v-slot:item.flavorProfile="{ item }">
                    <v-chip v-if="item.flavorProfile" color="pink" variant="tonal" size="small">
                        {{ item.flavorProfile }}
                    </v-chip>
                    <span v-else class="text-grey">暂无</span>
                </template>

                <!-- 应季信息 -->
                <template v-slot:item.seasonInfo="{ item }">
                    <v-chip v-if="item.seasonInfo" color="orange" variant="tonal" size="small">
                        {{ item.seasonInfo }}
                    </v-chip>
                    <span v-else class="text-grey">暂无</span>
                </template>

                <!-- 生活属性 -->
                <template v-slot:item.lifeProperties="{ item }">
                    <div class="life-properties-cell">
                        <template v-if="getLifePropertiesArray(item).length > 0">
                            <v-chip v-for="(property, index) in getLifePropertiesArray(item).slice(0, 2)" :key="index"
                                color="success" variant="tonal" size="x-small" class="mr-1 mb-1">
                                {{ property }}
                            </v-chip>
                            <v-tooltip v-if="getLifePropertiesArray(item).length > 2" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-chip v-bind="props" color="success" variant="outlined" size="x-small">
                                        +{{ getLifePropertiesArray(item).length - 2 }}
                                    </v-chip>
                                </template>
                                <div>
                                    <div v-for="property in getLifePropertiesArray(item).slice(2)" :key="property">
                                        {{ property }}
                                    </div>
                                </div>
                            </v-tooltip>
                        </template>
                        <span v-else class="text-grey">暂无</span>
                    </div>
                </template>

                <!-- 创建时间 -->
                <template v-slot:item.createdAt="{ item }">
                    <div class="text-caption">
                        {{ formatDate(item.createdAt) }}
                    </div>
                </template>

                <!-- 操作按钮 -->
                <template v-slot:item.actions="{ item }">
                    <div class="action-buttons-cell">
                        <v-btn icon size="small" color="info" variant="text" @click="viewFruit(item)" title="查看详情">
                            <v-icon size="18">mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon size="small" color="primary" variant="text" @click="editFruit(item)" title="编辑">
                            <v-icon size="18">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(item)" title="删除">
                            <v-icon size="18">mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </template>

                <!-- 无数据提示 -->
                <template v-slot:no-data>
                    <div class="no-data-container">
                        <v-icon size="64" color="grey-lighten-2">mdi-fruit-cherries-off</v-icon>
                        <h3 class="text-h6 mt-4 text-grey">暂无水果数据</h3>
                        <p class="text-body-2 text-grey">点击"添加水果"按钮开始添加</p>
                        <v-btn color="primary" variant="elevated" @click="openAddDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            添加第一个水果
                        </v-btn>
                    </div>
                </template>
            </v-data-table>

            <!-- 分页器 -->
            <v-card-actions class="justify-center pa-4">
                <v-pagination v-model="pagination.pageNum" :length="pagination.pages" :total-visible="7"
                    @update:model-value="handlePageChange" :disabled="loading" />
            </v-card-actions>
        </v-card>

        <!-- 添加/编辑对话框 -->
        <FruitEditDialog v-model="editDialog" :fruit="selectedFruit" :is-edit="isEditMode"
            @fruit-saved="handleFruitSaved" />

        <!-- 详情查看对话框 -->
        <FruitDetailDialog v-model="detailDialog" :fruit="selectedFruit" />

        <!-- 确认删除对话框 -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card rounded="lg">
                <v-card-title class="text-error">
                    <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                    确认删除
                </v-card-title>
                <v-card-text>
                    <p>确定要删除水果 <strong>{{ selectedFruit?.name }}</strong> 吗？</p>
                    <p class="text-caption text-error">此操作不可撤销！</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="deleteDialog = false">
                        取消
                    </v-btn>
                    <v-btn color="error" variant="elevated" @click="handleDelete" :loading="deleting">
                        删除
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 消息提示 -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// 假设 getFruitByName 已在 @/api/fruit 中定义并导出
import { getFruits, deleteFruit, getFruitByName as getFruitByNameFromApi, type Fruit, type PageRequestDTO, type PageInfo } from '@/api/fruit'
import FruitEditDialog from '@/components/FruitEditDialog.vue'
import FruitDetailDialog from '@/components/FruitDetailDialog.vue'
import { useRouter } from 'vue-router' // 导入 useRouter

const router = useRouter() // 初始化 router

// 响应式数据
const fruits = ref<Fruit[]>([])
const loading = ref(false)
const deleting = ref(false)
const searchKeyword = ref('') // 搜索关键词绑定到 v-text-field
const selectedFruit = ref<Fruit | null>(null)

// 对话框状态
const editDialog = ref(false)
const detailDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)

// 分页信息
const pagination = ref({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pages: 0
})

// 消息提示
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 表格列定义
const headers = [
    { title: '图片', key: 'imageUrl', sortable: false, width: '80px' },
    { title: '水果名称', key: 'name', sortable: true },
    { title: '口味特征', key: 'flavorProfile', sortable: false },
    { title: '应季信息', key: 'seasonInfo', sortable: false },
    { title: '生活属性', key: 'lifeProperties', sortable: false },
    { title: '创建时间', key: 'createdAt', sortable: true },
    { title: '操作', key: 'actions', sortable: false, width: '120px' }
]

// 计算属性
// const hasSearchKeyword = computed(() => !!searchKeyword.value.trim()) // 此计算属性可能不再需要，或用途改变

// 方法
const goBack = () => {
    router.back() // 或者 router.go(-1)
}

const loadFruits = async () => {
    try {
        loading.value = true

        const params: PageRequestDTO = {
            pageNum: pagination.value.pageNum,
            pageSize: pagination.value.pageSize
        }

        // 移除原有的 keyword 搜索逻辑，loadFruits 现在只加载全量数据（分页）
        // if (hasSearchKeyword.value) { 
        //     params.keyword = searchKeyword.value.trim()
        // }

        console.log('🔍 加载水果列表 (全量或分页)，请求参数:', params)

        const response = await getFruits(params)

        console.log('📦 收到水果列表响应:', response)

        if (response.code === 200 && response.data) {
            const pageInfo: PageInfo<Fruit> = response.data
            fruits.value = pageInfo.list || []

            pagination.value = {
                pageNum: pageInfo.pageNum,
                pageSize: pageInfo.pageSize,
                total: pageInfo.total,
                pages: pageInfo.pages
            }

            console.log('✅ 水果列表加载成功:', {
                count: fruits.value.length,
                total: pagination.value.total,
                pages: pagination.value.pages
            })
        } else {
            console.error('❌ 水果列表加载业务失败:', {
                code: response.code,
                msg: response.msg,
                data: response.data,
                success: response.success
            })
            showMessage(response.msg || `加载失败 (code: ${response.code})`, 'error')
            // 清空数据和分页，以防数据显示不一致
            fruits.value = []
            pagination.value = {
                ...pagination.value,
                pageNum: 1,
                total: 0,
                pages: 0
            }
        }
    } catch (error: any) {
        console.error('❌ 加载水果列表接口调用异常:', error)
        showMessage(error.message || '加载失败，请稍后重试', 'error')
        fruits.value = []
        pagination.value = {
            ...pagination.value,
            pageNum: 1,
            total: 0,
            pages: 0
        }
    } finally {
        loading.value = false
    }
}

const performNameSearch = async (name: string) => {
    if (!name) {
        loadFruits() // 如果名称为空，则加载所有水果
        return
    }
    try {
        loading.value = true
        console.log(`🔍 调用按名称搜索API, 名称: "${name}"`)
        // 假设 getFruitByNameFromApi 返回 Promise<{ code: number, data: Fruit | null, msg: string, success: boolean }>
        const response = await getFruitByNameFromApi(name)

        if (response.code === 200 && response.data) {
            console.log('📦 按名称搜索成功, 找到水果:', response.data)
            fruits.value = [response.data] // 显示为单项列表
            pagination.value = {
                ...pagination.value, // 保留 pageSize 设置
                pageNum: 1,
                total: 1,
                pages: 1
            }
            showMessage(`找到水果: ${response.data.name}`, 'success')
        } else {
            // 处理未找到或API返回错误的情况
            console.log('ℹ️ 按名称搜索未找到水果或发生错误:', response)
            fruits.value = []
            pagination.value = {
                ...pagination.value,
                pageNum: 1,
                total: 0,
                pages: 0
            }
            // 根据后端返回的 msg 判断是 "未找到" 还是其他错误
            if (response.msg && (response.msg.includes("未找到对应的水果信息") || response.msg.includes("not found"))) {
                showMessage(response.msg, 'info')
            } else {
                showMessage(response.msg || `搜索 "${name}" 失败`, 'error')
            }
        }
    } catch (error: any) {
        console.error('❌ 按名称搜索接口调用异常:', error)
        fruits.value = []
        pagination.value = {
            ...pagination.value,
            pageNum: 1,
            total: 0,
            pages: 0
        }
        showMessage(error.message || '搜索时发生网络错误，请稍后重试', 'error')
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    console.log(`🎤 用户执行搜索, 关键词: "${searchKeyword.value}"`)
    pagination.value.pageNum = 1 // 搜索时重置到第一页
    const searchTerm = searchKeyword.value.trim()
    if (searchTerm) {
        performNameSearch(searchTerm)
    } else {
        // 如果搜索框清空后按回车，则加载所有水果
        loadFruits()
    }
}

const clearSearch = () => {
    console.log('🧹 用户清空搜索关键词')
    searchKeyword.value = ''
    pagination.value.pageNum = 1 // 清空搜索时也重置到第一页
    loadFruits() // 调用 loadFruits 加载所有水果
}

const handlePageChange = (page: number) => {
    pagination.value.pageNum = page
    loadFruits()
}

const openAddDialog = () => {
    selectedFruit.value = null
    isEditMode.value = false
    editDialog.value = true
}

const editFruit = (fruit: Fruit) => {
    selectedFruit.value = { ...fruit }
    isEditMode.value = true
    editDialog.value = true
}

const viewFruit = (fruit: Fruit) => {
    selectedFruit.value = fruit
    detailDialog.value = true
}

const confirmDelete = (fruit: Fruit) => {
    selectedFruit.value = fruit
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedFruit.value?.id) return

    try {
        deleting.value = true
        const response = await deleteFruit(selectedFruit.value.id)

        if (response.code === 200) {
            showMessage('删除成功', 'success')
            deleteDialog.value = false
            loadFruits()
        } else {
            showMessage(response.msg || '删除失败', 'error')
        }
    } catch (error: any) {
        console.error('❌ 删除水果失败:', error)
        showMessage(error.message || '删除失败，请稍后重试', 'error')
    } finally {
        deleting.value = false
    }
}

const handleFruitSaved = () => {
    showMessage(isEditMode.value ? '更新成功' : '添加成功', 'success')
    loadFruits()
}

const getLifePropertiesArray = (fruit: Fruit): string[] => {
    if (!fruit.lifeProperties) return []

    try {
        const parsed = JSON.parse(fruit.lifeProperties)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const formatDate = (dateString?: string): string => {
    if (!dateString) return '未知时间'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return '时间格式错误'
    }
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 生命周期
onMounted(() => {
    loadFruits()
})
</script>

<style scoped>
.fruit-management {
    padding: 24px;
    background: #f5f5f5;
    min-height: 100vh;
}

.page-header {
    text-align: center;
    margin-bottom: 32px;
}

.page-header .position-relative {
    position: relative;
}

.back-button {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2E7D32;
    margin-bottom: 8px;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 0;
}

.action-bar {
    background: white;
}

.search-section {
    flex: 1;
    max-width: 400px;
}

.action-buttons {
    display: flex;
    gap: 12px;
}

/* 表格样式 */
.fruit-table {
    background: white;
}

.fruit-image-cell {
    padding: 8px;
}

.fruit-image {
    border: 2px solid #e0e0e0;
    transition: border-color 0.3s ease;
}

.fruit-image:hover {
    border-color: #4CAF50;
}

.no-image-placeholder,
.error-placeholder {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px;
    border: 2px dashed #ddd;
}

.fruit-name-cell {
    max-width: 200px;
}

.fruit-name {
    font-weight: 600;
    color: #2E7D32;
    margin-bottom: 4px;
}

.fruit-description {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.life-properties-cell {
    max-width: 120px;
}

.action-buttons-cell {
    display: flex;
    gap: 4px;
}

.no-data-container {
    text-align: center;
    padding: 48px 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .fruit-management {
        padding: 16px;
    }

    .page-title {
        font-size: 2rem;
    }

    .action-bar .d-flex {
        flex-direction: column;
        gap: 16px;
    }

    .search-section {
        max-width: none;
        width: 100%;
    }

    .action-buttons {
        width: 100%;
        justify-content: space-between;
    }
}

/* 深色主题支持 */
.v-theme--dark .fruit-management {
    background: #121212;
}

.v-theme--dark .action-bar {
    background: #1e1e1e;
}

.v-theme--dark .fruit-table {
    background: #1e1e1e;
}
</style>
