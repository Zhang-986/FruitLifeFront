<template>
  <div class="task-management">
    <!-- 使用统一导航 -->
    <AppNavigation />

    <!-- 主要内容区域 -->
    <div class="management-content">
      <v-container fluid class="pa-6">
        <!-- 页面标题和返回按钮 -->
        <div class="page-header mb-6">
          <v-card class="header-card task-gradient" elevation="6" rounded="xl">
            <v-card-text class="pa-6">
              <div class="d-flex align-center">
                <v-btn icon variant="text" @click="goBack" class="mr-4 back-btn">
                  <v-icon color="white">mdi-arrow-left</v-icon>
                </v-btn>
                <div class="flex-grow-1">
                  <h1 class="text-h4 font-weight-bold text-white mb-2">
                    <v-icon color="white" class="mr-3">mdi-clipboard-text</v-icon>
                    任务管理系统
                  </h1>
                  <p class="text-subtitle-1 text-white opacity-90 mb-0">
                    管理用户任务、积分奖励和活动状态 - 共 {{ pagination.total }} 个任务
                  </p>
                </div>
                <v-btn color="white" variant="elevated" size="large" @click="showAddDialog = true">
                  <v-icon start color="primary">mdi-plus</v-icon>
                  <span class="text-primary font-weight-bold">添加任务</span>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- 搜索和筛选 -->
        <div class="search-section mb-6">
          <v-card elevation="3" rounded="xl">
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="searchQuery" placeholder="搜索任务标题..." prepend-inner-icon="mdi-magnify"
                    variant="outlined" density="comfortable" clearable @input="handleSearch" rounded="lg" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select v-model="statusFilter" :items="statusOptions" placeholder="任务状态"
                    prepend-inner-icon="mdi-filter" variant="outlined" density="comfortable" clearable
                    @update:model-value="handleFilter" rounded="lg" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select v-model="sortBy" :items="sortOptions" placeholder="排序方式" prepend-inner-icon="mdi-sort"
                    variant="outlined" density="comfortable" @update:model-value="handleSort" rounded="lg" />
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn color="primary" variant="outlined" block @click="resetFilters">
                    <v-icon start>mdi-refresh</v-icon>
                    重置
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- 任务列表 -->
        <div class="task-list">
          <v-row>
            <v-col v-for="task in filteredTasks" :key="task.id" cols="12" md="6" lg="4">
              <v-card class="task-card" elevation="4" rounded="xl" hover>
                <!-- 任务状态标识 -->
                <div class="task-status">
                  <v-chip :color="task.isActive ? 'success' : 'grey'" :variant="task.isActive ? 'elevated' : 'tonal'"
                    size="small">
                    <v-icon start :icon="task.isActive ? 'mdi-check-circle' : 'mdi-pause-circle'"></v-icon>
                    {{ task.isActive ? '激活' : '禁用' }}
                  </v-chip>
                </div>

                <!-- 任务内容 -->
                <v-card-text class="pa-4">
                  <h3 class="task-title mb-2">{{ task.title }}</h3>
                  <p class="task-description text-body-2 text-grey-darken-1 mb-3">
                    {{ task.description || '暂无描述' }}
                  </p>

                  <!-- 积分奖励 -->
                  <div class="points-display mb-3">
                    <v-chip color="orange" variant="tonal" size="large">
                      <v-icon start>mdi-medal</v-icon>
                      {{ task.points }} 积分
                    </v-chip>
                  </div>

                  <!-- 时间信息 -->
                  <div class="time-info">
                    <p class="text-caption text-grey">
                      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                      创建于: {{ formatDate(task.createdAt) }}
                    </p>
                    <p v-if="task.updatedAt && task.updatedAt !== task.createdAt" class="text-caption text-grey">
                      <v-icon size="small" class="mr-1">mdi-update</v-icon>
                      更新于: {{ formatDate(task.updatedAt) }}
                    </p>
                  </div>
                </v-card-text>

                <!-- 操作按钮 -->
                <v-card-actions class="pa-4 pt-0">
                  <v-btn size="small" variant="outlined" @click="viewTask(task)">
                    <v-icon start size="small">mdi-eye</v-icon>
                    查看
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn size="small" color="primary" @click="editTask(task)" class="mr-2">
                    <v-icon start size="small">mdi-pencil</v-icon>
                    编辑
                  </v-btn>
                  <v-btn size="small" color="error" variant="outlined" @click="promptDeleteTask(task)">
                    <v-icon start size="small">mdi-delete</v-icon>
                    删除
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <!-- 分页组件 -->
          <div class="pagination-section mt-8 mb-4" v-if="pagination.total > 0">
            <v-card elevation="2" rounded="xl" class="pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap">
                <!-- 分页信息 -->
                <div class="pagination-info">
                  <v-chip color="primary" variant="tonal" class="mr-2">
                    <v-icon start size="small">mdi-information</v-icon>
                    第 {{ pagination.pageNum }} 页，共 {{ totalPages }} 页
                  </v-chip>
                  <v-chip color="success" variant="tonal">
                    <v-icon start size="small">mdi-clipboard-text</v-icon>
                    共 {{ pagination.total }} 个任务
                  </v-chip>
                </div>

                <!-- 分页控件 -->
                <div class="pagination-controls">
                  <v-pagination v-model="pagination.pageNum" :length="totalPages" :total-visible="5" rounded="circle"
                    color="primary" variant="elevated" @update:model-value="handlePageChange"
                    class="my-2"></v-pagination>
                </div>

                <!-- 每页大小选择 -->
                <div class="page-size-selector">
                  <v-select v-model="pagination.pageSize" :items="pageSizeOptions" label="每页显示" variant="outlined"
                    density="compact" style="width: 120px" @update:model-value="handlePageSizeChange"></v-select>
                </div>
              </div>
            </v-card>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredTasks.length === 0 && !loading" class="empty-state text-center py-12">
            <v-icon size="80" color="grey-lighten-2">mdi-clipboard-off</v-icon>
            <h3 class="text-h5 mt-4 mb-2">暂无任务数据</h3>
            <p class="text-grey mb-4">还没有添加任何任务，点击下方按钮开始添加</p>
            <v-btn color="primary" size="large" @click="showAddDialog = true">
              <v-icon start>mdi-plus</v-icon>
              添加第一个任务
            </v-btn>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
            <p class="mt-4 text-grey">加载中...</p>
          </div>
        </div>
      </v-container>
    </div>

    <!-- 任务编辑对话框 -->
    <TaskEditDialog v-model="showEditDialog" :task="currentTask" :is-edit="isEditMode" @task-saved="handleTaskSaved" />

    <!-- 添加任务对话框 -->
    <TaskEditDialog v-model="showAddDialog" :is-edit="false" @task-saved="handleTaskSaved" />

    <!-- 任务详情对话框 -->
    <v-dialog v-model="showViewDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center pa-4 task-gradient">
          <v-icon color="white" class="mr-3">mdi-information-outline</v-icon>
          <span class="text-h5 text-white font-weight-bold">任务详情</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="showViewDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6" v-if="currentTask">
          <h3 class="text-h6 mb-2 primary--text">{{ currentTask.title }}</h3>
          <p class="text-body-1 mb-4 grey--text text--darken-2">
            {{ currentTask.description || '暂无描述' }}
          </p>
          <v-divider class="my-4"></v-divider>
          <v-row>
            <v-col cols="12" sm="6">
              <v-chip color="orange" variant="tonal" size="large" block class="mb-2">
                <v-icon start>mdi-medal</v-icon>
                奖励积分: {{ currentTask.points }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6">
              <v-chip :color="currentTask.isActive ? 'success' : 'grey'" variant="tonal" size="large" block
                class="mb-2">
                <v-icon start>{{ currentTask.isActive ? 'mdi-check-circle' : 'mdi-pause-circle' }}</v-icon>
                状态: {{ currentTask.isActive ? '激活' : '禁用' }}
              </v-chip>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <div class="time-info">
            <p class="text-caption text-grey">
              <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
              创建于: {{ formatDate(currentTask.createdAt) }}
            </p>
            <p v-if="currentTask.updatedAt && currentTask.updatedAt !== currentTask.createdAt"
              class="text-caption text-grey">
              <v-icon size="small" class="mr-1">mdi-update</v-icon>
              更新于: {{ formatDate(currentTask.updatedAt) }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="tonal" @click="showViewDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 自定义删除确认对话框 -->
    <v-dialog v-model="showDeleteDialog" persistent max-width="450px" rounded="xl">
      <v-card class="delete-confirm-card" rounded="xl">
        <v-card-title class="text-h5 bg-error d-flex align-center">
          <v-icon start color="white">mdi-alert-circle-outline</v-icon>
          <span class="text-white font-weight-bold">确认删除任务</span>
        </v-card-title>
        <v-card-text class="pt-6 pb-6 text-body-1">
          您确定要删除任务 "<strong>{{ taskToDelete?.title }}</strong>" 吗？
          <br />
          <span class="text-warning">⚠️ 此操作无法撤销，任务相关的所有数据都将被永久删除。</span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cancelDelete" :disabled="deleting" class="action-btn">
            取消
          </v-btn>
          <v-btn color="error" variant="elevated" @click="confirmDelete" :loading="deleting" class="action-btn">
            <v-icon start>mdi-delete-forever</v-icon>
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAllTask, deleteTask as deleteTaskApi, type Task } from '@/api/task'
import AppNavigation from '@/components/AppNavigation.vue'
import TaskEditDialog from '@/components/TaskEditDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const tasks = ref<Task[]>([])
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')
const showEditDialog = ref(false)
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const currentTask = ref<Task | null>(null)
const taskToDelete = ref<Task | null>(null)
const isEditMode = ref(false)

// 分页数据
const pagination = ref({
  pageNum: 1,
  pageSize: 12,
  total: 0
})

// 分页选项
const pageSizeOptions = [
  { title: '12个/页', value: 12 },
  { title: '18个/页', value: 18 },
  { title: '24个/页', value: 24 },
  { title: '30个/页', value: 30 }
]

// 选项数据
const statusOptions = [
  { title: '激活任务', value: 'active' },
  { title: '禁用任务', value: 'inactive' }
]

const sortOptions = [
  { title: '按创建时间', value: 'createdAt' },
  { title: '按更新时间', value: 'updatedAt' },
  { title: '按积分高低', value: 'points' },
  { title: '按标题排序', value: 'title' }
]

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(pagination.value.total / pagination.value.pageSize)
})

const filteredTasks = computed(() => {
  let result = [...tasks.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    if (statusFilter.value === 'active') {
      result = result.filter(task => task.isActive)
    } else if (statusFilter.value === 'inactive') {
      result = result.filter(task => !task.isActive)
    }
  }

  // 排序
  if (sortBy.value === 'createdAt') {
    result.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })
  } else if (sortBy.value === 'updatedAt') {
    result.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return bTime - aTime
    })
  } else if (sortBy.value === 'points') {
    result.sort((a, b) => (b.points || 0) - (a.points || 0))
  } else if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }

  return result
})

// 方法
const goBack = () => {
  router.push('/zzk')
}

const loadTasks = async () => {
  loading.value = true
  try {
    console.log('🔄 开始加载任务列表，参数:', {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    })

    const response = await getAllTask({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    })

    console.log('📦 收到API响应:', response)

    if (response.code === 200) {
      const pageInfo = response.data
      if (pageInfo && pageInfo.list) {
        tasks.value = pageInfo.list
        pagination.value.total = pageInfo.total || 0
        console.log('✅ 处理任务数据成功:', {
          count: tasks.value.length,
          total: pagination.value.total,
          currentPage: pagination.value.pageNum,
          totalPages: totalPages.value
        })
      } else {
        console.warn('⚠️ 未知的数据格式:', response.data)
        tasks.value = []
      }
    } else {
      console.error('❌ API返回错误代码:', response.code, response.msg)
      tasks.value = []
    }
  } catch (error) {
    console.error('❌ 加载任务列表失败:', error)
    tasks.value = []
  } finally {
    loading.value = false
    console.log('🏁 加载完成，当前任务数量:', tasks.value.length)
  }
}

// 分页相关方法
const handlePageChange = async (page: number) => {
  console.log('📄 切换到第', page, '页')
  pagination.value.pageNum = page
  await loadTasks()
}

const handlePageSizeChange = async (size: number) => {
  console.log('📏 每页大小改为:', size)
  pagination.value.pageSize = size
  pagination.value.pageNum = 1 // 重置到第一页
  await loadTasks()
}

const handleSearch = () => {
  console.log('🔍 搜索:', searchQuery.value)
}

const handleFilter = () => {
  console.log('🔽 筛选:', statusFilter.value)
}

const handleSort = () => {
  console.log('🔄 排序:', sortBy.value)
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  sortBy.value = 'createdAt'
  console.log('🔄 重置筛选条件')
  // 不需要重新加载任务，因为过滤是在前端完成的
  // 如果是后端过滤，则需要调用 loadTasks()
}

const viewTask = (task: Task) => {
  console.log('👁️ 查看任务:', task.title)
  currentTask.value = task
  showViewDialog.value = true
}

const editTask = (task: Task) => {
  currentTask.value = task
  isEditMode.value = true
  showEditDialog.value = true
}

// 打开删除确认对话框
const promptDeleteTask = (task: Task) => {
  taskToDelete.value = task
  showDeleteDialog.value = true
}

// 取消删除
const cancelDelete = () => {
  showDeleteDialog.value = false
  taskToDelete.value = null
}

// 确认删除
const confirmDelete = async () => {
  if (!taskToDelete.value || !taskToDelete.value.id) return

  deleting.value = true
  try {
    const response = await deleteTaskApi(taskToDelete.value.id)
    if (response.code === 200) {
      console.log('✅ 删除成功')
      await loadTasks()
    }
  } catch (error) {
    console.error('❌ 删除任务失败:', error)
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
    taskToDelete.value = null
  }
}

const handleTaskSaved = async () => {
  console.log('🔄 任务保存成功，重新加载列表')
  await loadTasks()
  showEditDialog.value = false
  showAddDialog.value = false
  currentTask.value = null
  isEditMode.value = false
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}

onMounted(async () => {
  console.log('🚀 组件挂载，开始初始化')

  // 检查管理员权限
  if (!authStore.isLoggedIn) {
    console.warn('⚠️ 未登录，跳转到登录页')
    router.push('/login')
    return
  }

  if (!authStore.isAdmin) {
    console.warn('⚠️ 权限不足，跳转回主页')
    router.push('/')
    return
  }

  // 加载任务数据
  await loadTasks()

  // 检查是否有添加操作参数
  if (route.query.action === 'add') {
    showAddDialog.value = true
  }
})
</script>

<style scoped>
.task-management {
  min-height: 100vh;
  background: #f5f5f5;
}

.management-content {
  margin-top: 64px;
}

.task-gradient {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
}

.task-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.task-status {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.task-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #FF9800;
  line-height: 1.3;
}

.task-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.points-display {
  display: flex;
  justify-content: center;
}

.time-info p {
  margin-bottom: 4px;
}

.pagination-section {
  border-top: 2px solid #FFE0B2;
}

.pagination-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-controls {
  flex: 1;
  display: flex;
  justify-content: center;
}

.page-size-selector {
  display: flex;
  align-items: center;
}

.empty-state {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 移动端适配 */
@media (max-width: 960px) {
  .pagination-section .d-flex {
    flex-direction: column;
    gap: 16px;
  }

  .pagination-info {
    justify-content: center;
  }

  .page-size-selector {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .management-content {
    margin-top: 56px;
  }

  .pagination-section {
    margin-left: -16px;
    margin-right: -16px;
  }
}

.delete-confirm-card .v-card-title {
  padding-top: 20px;
  padding-bottom: 20px;
}

.delete-confirm-card .action-btn {
  min-width: 100px;
  height: 44px !important;
  font-weight: 600 !important;
}
</style>
