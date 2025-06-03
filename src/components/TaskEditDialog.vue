<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px"
    persistent>
    <v-card rounded="xl" elevation="12">
      <!-- 对话框标题 -->
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <div class="title-icon mr-3">
            <v-icon :color="isEdit ? 'primary' : 'success'" size="32">
              {{ isEdit ? 'mdi-pencil-circle' : 'mdi-plus-circle' }}
            </v-icon>
          </div>
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">
              {{ isEdit ? '编辑任务' : '创建新任务' }}
            </h2>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              {{ isEdit ? '修改任务信息和奖励设置' : '添加新的任务和积分奖励' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 表单内容 -->
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-row>
            <!-- 任务标题 -->
            <v-col cols="12">
              <v-text-field v-model="formData.title" label="任务标题" placeholder="请输入任务标题..." variant="outlined"
                :rules="titleRules" prepend-inner-icon="mdi-format-title" counter="50" maxlength="50" clearable required
                density="comfortable" />
            </v-col>

            <!-- 任务描述 -->
            <v-col cols="12">
              <v-textarea v-model="formData.description" label="任务描述" placeholder="请输入任务的详细描述..." variant="outlined"
                rows="4" counter="200" maxlength="200" clearable prepend-inner-icon="mdi-text-box-outline"
                density="comfortable" />
            </v-col>

            <!-- 积分奖励 -->
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.points" label="积分奖励" placeholder="输入积分数量" variant="outlined" type="number"
                min="1" max="10000" :rules="pointsRules" prepend-inner-icon="mdi-medal" suffix="积分" required
                density="comfortable" />
            </v-col>

            <!-- 任务状态 -->
            <v-col cols="12" md="6">
              <div class="status-section">
                <label class="status-label">任务状态</label>
                <v-switch v-model="formData.isActive" color="success" :label="formData.isActive ? '激活' : '禁用'" inset
                  hide-details class="mt-2">
                  <template #prepend>
                    <v-icon :color="formData.isActive ? 'success' : 'grey'" size="20">
                      {{ formData.isActive ? 'mdi-check-circle' : 'mdi-pause-circle' }}
                    </v-icon>
                  </template>
                </v-switch>
              </div>
            </v-col>
          </v-row>

          <!-- 预览卡片 -->
          <v-col cols="12" class="mt-4">
            <v-card variant="outlined" rounded="lg" class="preview-card">
              <v-card-subtitle class="pb-2">
                <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                预览效果
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <div class="d-flex align-center mb-2">
                  <h4 class="task-preview-title">{{ formData.title || '任务标题' }}</h4>
                  <v-spacer></v-spacer>
                  <v-chip :color="formData.isActive ? 'success' : 'grey'" size="small" variant="tonal">
                    {{ formData.isActive ? '激活' : '禁用' }}
                  </v-chip>
                </div>
                <p class="task-preview-desc text-body-2 mb-2">
                  {{ formData.description || '任务描述...' }}
                </p>
                <v-chip color="orange" variant="tonal" size="small">
                  <v-icon start size="16">mdi-medal</v-icon>
                  {{ formData.points || 0 }} 积分
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- 操作按钮 -->
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="grey" @click="handleCancel" :disabled="loading" size="large">
          取消
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleSave" :loading="loading" :disabled="!formValid"
          size="large" class="ml-3">
          <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
          {{ isEdit ? '保存修改' : '创建任务' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { addTask, editTask, type Task } from '@/api/task'

// Props 定义
interface Props {
  modelValue: boolean
  task?: Task | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  task: null
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'task-saved': []
}>()

// 响应式数据
const loading = ref(false)
const formValid = ref(false)
const formRef = ref()

// 表单数据
const formData = ref({
  title: '',
  description: '',
  points: 10,
  isActive: true
})

// 表单验证规则
const titleRules = [
  (v: string) => !!v || '任务标题不能为空',
  (v: string) => (v && v.length >= 2) || '任务标题至少2个字符',
  (v: string) => (v && v.length <= 50) || '任务标题不能超过50个字符'
]

const pointsRules = [
  (v: number | string) => !!v || '积分奖励不能为空',
  (v: number | string) => {
    const num = Number(v)
    return num > 0 || '积分必须大于0'
  },
  (v: number | string) => {
    const num = Number(v)
    return num <= 10000 || '积分不能超过10000'
  }
]

// 监听对话框打开状态，初始化表单数据
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initFormData()
  }
}, { immediate: true })

// 监听任务数据变化
watch(() => props.task, () => {
  if (props.modelValue) {
    initFormData()
  }
}, { deep: true })

// 初始化表单数据
const initFormData = () => {
  if (props.isEdit && props.task) {
    formData.value = {
      title: props.task.title || '',
      description: props.task.description || '',
      points: props.task.points || 10,
      // 后端传来的 isActive 可能是数字 0 或 1，或者已经是布尔值
      // 如果是数字，则 1 代表 true (激活)，0 代表 false (禁用)
      // 如果已经是布尔值，则直接使用
      // 使用 `?? true` 作为默认值，确保在 props.task.isActive 为 undefined 或 null 时，默认为激活
      isActive: typeof props.task.isActive === 'number' ? props.task.isActive === 1 : (props.task.isActive ?? true)
    }
    console.log('编辑模式 - 初始化表单数据:', JSON.parse(JSON.stringify(formData.value)));
    console.log('原始 task.isActive:', props.task.isActive, '转换后:', formData.value.isActive);
  } else {
    // 新建模式，重置表单
    formData.value = {
      title: '',
      description: '',
      points: 10,
      isActive: false // <--- 修改：新任务 isActive 默认为 false (未激活/禁用)
    }
  }

  // 重置验证状态
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// 处理取消
const handleCancel = () => {
  emit('update:modelValue', false)
  // 延迟重置，避免动画问题
  setTimeout(() => {
    initFormData()
  }, 300)
}

// 处理保存
const handleSave = async () => {
  // 验证表单
  if (!formRef.value?.validate()) {
    return
  }

  loading.value = true
  try {
    const taskData = {
      title: formData.value.title.trim(),
      description: formData.value.description?.trim() || '',
      points: Number(formData.value.points),
      isActive: formData.value.isActive // 重点：此时 isActive 是布尔值 (true 或 false)
    }
    // 添加日志，确认 taskData 中的 isActive 值
    console.log('TaskEditDialog: taskData before API call', JSON.parse(JSON.stringify(taskData)));


    if (props.isEdit && props.task?.id) {
      // 编辑模式
      // editTask 函数应在其内部处理布尔到数字的转换
      const response = await editTask({
        id: props.task.id,
        ...taskData
      })

      if (response.code === 200) {
        console.log('✅ 任务编辑成功')
        emit('task-saved')
        emit('update:modelValue', false)
      } else {
        console.error('❌ 任务编辑失败:', response.msg)
      }
    } else {
      // 新建模式
      // addTask 函数应在其内部处理布尔到数字的转换
      const response = await addTask(taskData)

      if (response.code === 200) {
        console.log('✅ 任务创建成功')
        emit('task-saved')
        emit('update:modelValue', false)
      } else {
        console.error('❌ 任务创建失败:', response.msg)
      }
    }
  } catch (error) {
    console.error(`❌ ${props.isEdit ? '编辑' : '创建'}任务失败:`, error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.title-icon {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.status-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.preview-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
}

.task-preview-title {
  color: #FF9800;
  font-weight: 600;
}

.task-preview-desc {
  color: #666;
  min-height: 20px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  :deep(.v-dialog) {
    margin: 16px;
  }
}
</style>
