# 🤖 AI开发助手规范指南

> **📋 所有AI助手必读！协助开发前请仔细阅读此规范**

## 🎯 项目概况
- **技术栈：** Vue 3 + TypeScript + Vuetify 3 + Pinia
- **主题：** 水果生活管理前端应用
- **代码风格：** 组合式API + ESLint + Prettier

---

## 🚫 严格禁止事项

### ❌ 绝对不能做
1. **不得删除或修改现有文件**（除非明确要求）
2. **禁止使用选项式API**（data(), methods等）
3. **不得破坏现有的类型定义和接口**
4. **不得移除必要的import语句**
5. **不得修改已有组件的核心功能**

---

## ✅ 必须遵循的规范

### 🏗️ Vue 3 组合式API规范
```typescript
// ✅ 标准结构
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props定义
interface Props {
  title: string
}
const props = defineProps<Props>()

// Emits定义  
const emit = defineEmits<{
  'update': [value: string]
}>()

// 响应式状态
const loading = ref(false)

// 计算属性
const displayText = computed(() => `${props.title}`)

// 方法
const handleClick = () => {}

// 生命周期
onMounted(() => {})
</script>
```

### 🎨 样式和主题规范
- **主色调：** `#4CAF50`（水果绿）
- **渐变按钮：** `linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)`
- **圆角：** `rounded="lg"` 或 `border-radius: 12px`
- **阴影：** `elevation="4"` 或 `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`

### 📝 TypeScript类型规范
```typescript
// ✅ 接口定义
interface User {
  id: number
  name: string
  email?: string  // 可选属性用?
}

// ✅ API响应类型
interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}
```

### 🔧 组件开发规范
```vue
<!-- ✅ 组件命名：PascalCase -->
<template>
  <v-card elevation="4" rounded="xl">
    <!-- 内容 -->
  </v-card>
</template>

<script setup lang="ts">
// ✅ 文件顺序：imports → props → emits → 状态 → 计算属性 → 方法 → 生命周期
</script>

<style scoped>
/* ✅ 使用项目主题色 */
.primary-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}
</style>
```

---

## 📊 现有核心模块（禁止破坏）

### 🍎 水果管理
- `FruitEditDialog.vue` - 编辑对话框（含图片自动获取）
- `FruitDetailDialog.vue` - 详情展示
- `ZzkAdmin.vue` - 管理页面

### 👤 用户系统
- `ProfileWizard.vue` - 资料完善向导
- `UserAvatar.vue` - 头像组件
- `AppNavigation.vue` - 导航栏

### 🔧 核心功能
- 路由守卫、权限管理、图片API、表单验证

---

## 🎯 开发指导原则

### 📂 文件命名
```
components/     # PascalCase: UserAvatar.vue
views/         # PascalCase: HomeView.vue  
stores/        # camelCase: auth.ts
utils/         # kebab-case: image-api.ts
```

### 🌐 API调用模式
```typescript
// ✅ 统一模式
const loading = ref(false)
const error = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const response = await api.getData()
    if (response.code === 200) {
      // 处理成功
    }
  } catch (err) {
    error.value = '请求失败'
  } finally {
    loading.value = false
  }
}
```

### 🎨 UI组件使用
```vue
<!-- ✅ Vuetify规范 -->
<v-btn color="primary" variant="elevated" rounded="lg">
  <v-icon start>mdi-check</v-icon>
  确认
</v-btn>

<v-card elevation="4" rounded="xl" class="fruit-card">
  <!-- 内容 -->
</v-card>
```

### 📱 移动端适配
```css
/* ✅ 响应式设计 */
@media (max-width: 600px) {
  .desktop-feature {
    display: none;
  }
  .card {
    margin: 8px;
  }
}
```

---

## 🐛 错误处理规范

### 📝 日志格式
```typescript
// ✅ 统一日志
console.log('🚀 开始操作')
console.log('✅ 操作成功:', data)
console.error('❌ 操作失败:', error)
console.warn('⚠️ 警告信息:', warning)
```

### 🛡️ 错误处理
```typescript
// ✅ 统一错误处理
try {
  await someOperation()
} catch (error: any) {
  const message = error.name === 'BusinessError' 
    ? error.message 
    : '操作失败，请稍后重试'
  showMessage(message, 'error')
}
```

---

## 🔐 安全和权限

### 🛡️ 权限检查
```typescript
// ✅ 登录检查
if (!authStore.isLoggedIn) {
  router.push('/login')
  return
}

// ✅ 管理员检查  
if (!authStore.isAdmin) {
  showMessage('权限不足', 'error')
  return
}
```

---

## 🤝 AI协作指南

### 🎯 接手任务时
1. **先了解** - 阅读相关组件代码
2. **保持一致** - 遵循现有代码风格  
3. **增量改进** - 只增强，不破坏
4. **测试确认** - 确保修改无副作用

### 💡 提供建议时
1. **具体可行** - 提供可直接使用的代码
2. **考虑兼容** - 确保与现有代码兼容
3. **用户优先** - 优先考虑用户体验
4. **性能友好** - 避免性能问题

### 🔄 代码质量
- 遵循ESLint规则
- 确保TypeScript类型正确
- 移除调试代码
- 测试移动端适配

---

## 🚨 重要提醒

> **在进行任何修改前：**
> 1. 阅读此规范文档
> 2. 了解现有代码结构  
> 3. 确认修改必要性
> 4. 保持项目整体风格一致
> 
> **目标：构建高质量、可维护的现代化前端应用！**

---

*📅 最后更新：2024年12月*
*💡 遇到问题请及时沟通确认*
