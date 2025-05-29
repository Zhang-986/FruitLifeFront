<template>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import UserAvatar from './UserAvatar.vue'

// 使用与avatar store一致的类型定义
type AvatarType = 'letter' | 'emoji' | 'fruit' | 'color'

// 本地AvatarConfig接口定义
interface AvatarConfig {
    type: AvatarType
    fruit?: string
    emoji?: string
    color?: string
}

// Props
interface Props {
    modelValue: boolean
    user?: {
        email?: string
        nickname?: string
        id?: number
    }
    currentAvatarType?: AvatarType
}

const props = withDefaults(defineProps<Props>(), {
    currentAvatarType: 'fruit'
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'select': [avatarConfig: AvatarConfig]
}>()

// 响应式数据
const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const selectedTypeIndex = ref(0)
const selectedFruit = ref('🍎')
const selectedColor = ref('#FF6B6B')

// 头像类型选项 - 添加emoji类型
const avatarTypes: Array<{ value: AvatarType; label: string; icon: string }> = [
    { value: 'fruit', label: '水果头像', icon: 'mdi-apple' },
    { value: 'emoji', label: '表情头像', icon: 'mdi-emoticon' },
    { value: 'color', label: '彩色头像', icon: 'mdi-palette' },
    { value: 'letter', label: '字母头像', icon: 'mdi-alphabetical' }
]

// 水果选项
const fruitOptions = [
    '🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒',
    '🥭', '🍍', '🥥', '🍈', '🍉', '🍋', '🍐', '🥑'
]

// 颜色选项
const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
]

// 计算属性
const selectedType = computed((): AvatarType => {
    return avatarTypes[selectedTypeIndex.value]?.value || 'fruit'
})

const previewUser = computed(() => {
    const baseUser = props.user || { email: 'user@example.com', nickname: '用户' }

    // 根据选择的类型生成不同的预览
    if (selectedType.value === 'fruit') {
        return { ...baseUser, nickname: selectedFruit.value }
    } else if (selectedType.value === 'color') {
        return { ...baseUser, nickname: baseUser.nickname || baseUser.email?.split('@')[0] || '用户' }
    } else {
        return baseUser
    }
})

// 方法
const selectFruit = (fruit: string) => {
    selectedFruit.value = fruit
}

const selectColor = (color: string) => {
    selectedColor.value = color
}

const getContrastColor = (hexColor: string): string => {
    // 移除#号
    const color = hexColor.replace('#', '')

    // 转换为RGB
    const r = parseInt(color.substr(0, 2), 16)
    const g = parseInt(color.substr(2, 2), 16)
    const b = parseInt(color.substr(4, 2), 16)

    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    // 根据亮度返回黑色或白色
    return brightness > 128 ? '#000000' : '#FFFFFF'
}

const handleCancel = () => {
    showDialog.value = false
}

const handleConfirm = () => {
    const config: AvatarConfig = {
        type: selectedType.value,
        ...(selectedType.value === 'fruit' && { fruit: selectedFruit.value }),
        ...(selectedType.value === 'emoji' && { emoji: selectedFruit.value }),
        ...(selectedType.value === 'color' && { color: selectedColor.value })
    }

    emit('select', config)
    showDialog.value = false
}

// 初始化选择
watch(() => props.currentAvatarType, (newType) => {
    const index = avatarTypes.findIndex(type => type.value === newType)
    if (index !== -1) {
        selectedTypeIndex.value = index
    }
}, { immediate: true })
</script>

<style scoped>
.fruit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 12px;
    padding: 8px;
}

.fruit-btn {
    aspect-ratio: 1;
    min-height: 60px;
}

.fruit-emoji {
    font-size: 24px;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 12px;
    padding: 8px;
}

.color-btn {
    aspect-ratio: 1;
    min-height: 50px;
    border-width: 2px !important;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .fruit-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    .color-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
