<template>
    <div class="user-avatar-wrapper">
        <!-- 头像显示 -->
        <v-avatar :size="size" :color="avatarColor" class="user-avatar" :class="{ 'clickable': clickable }"
            @click="handleAvatarClick">
            <!-- Emoji头像 -->
            <span v-if="finalEmojiAvatar" class="emoji-avatar" :style="{ fontSize: emojiSize }">
                {{ finalEmojiAvatar }}
            </span>

            <!-- 文字头像 -->
            <span v-else class="text-avatar" :style="{ fontSize: textSize, fontWeight: 'bold' }">
                {{ avatarText }}
            </span>
        </v-avatar>

        <!-- 头像选择对话框 -->
        <v-dialog v-model="showAvatarDialog" max-width="500" @click:outside="handleDialogClose">
            <v-card class="avatar-selector-card" rounded="xl">
                <v-card-title class="avatar-selector-header">
                    <div class="d-flex align-center">
                        <v-icon color="primary" class="mr-3">mdi-account-circle</v-icon>
                        <span class="text-h5 font-weight-bold">自定义头像</span>
                    </div>
                    <v-btn icon variant="text" @click="showAvatarDialog = false" class="ml-auto">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-6">
                    <!-- 当前头像预览 -->
                    <div class="current-avatar-preview text-center mb-6">
                        <h3 class="mb-3">预览效果</h3>
                        <v-avatar size="80" :color="selectedColor" class="preview-avatar">
                            <span v-if="selectedEmoji" class="emoji-avatar" style="font-size: 40px;">
                                {{ selectedEmoji }}
                            </span>
                            <span v-else class="text-avatar" style="font-size: 32px; font-weight: bold;">
                                {{ avatarText }}
                            </span>
                        </v-avatar>
                    </div>

                    <!-- 颜色选择 -->
                    <div class="mb-6">
                        <h4 class="mb-3">选择背景颜色</h4>
                        <div class="color-grid">
                            <v-btn v-for="color in colorOptions" :key="color.value" :color="color.value" icon
                                size="large" class="color-option" :class="{ 'selected': selectedColor === color.value }"
                                @click="selectColor(color.value)" :title="color.name">
                                <v-icon v-if="selectedColor === color.value" color="white">mdi-check</v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <!-- 表情选择 -->
                    <div class="mb-4">
                        <h4 class="mb-3">选择表情头像（可选）</h4>

                        <!-- 分类标签 -->
                        <v-chip-group v-model="selectedCategory" class="mb-4">
                            <v-chip v-for="category in emojiCategories" :key="category.name" :value="category.name"
                                filter variant="outlined">
                                {{ category.label }}
                            </v-chip>
                        </v-chip-group>

                        <!-- 当前分类的表情 -->
                        <div class="emoji-grid">
                            <!-- 清除表情选项 -->
                            <div class="emoji-item clear-option" :class="{ 'selected': !selectedEmoji }"
                                @click="clearEmoji" title="使用文字头像">
                                <v-icon size="20">mdi-text</v-icon>
                            </div>

                            <div v-for="emoji in currentCategoryEmojis" :key="emoji" class="emoji-item"
                                :class="{ 'selected': selectedEmoji === emoji }" @click="selectEmoji(emoji)">
                                <span class="emoji-display">{{ emoji }}</span>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn variant="outlined" @click="showAvatarDialog = false">
                        取消
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="flat" @click="saveAvatar" :loading="saving">
                        保存头像
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAvatarStore } from '@/stores/avatar'

// Props定义
interface UserInfo {
    email?: string
    nickname?: string
    id?: number
}

const props = withDefaults(defineProps<{
    user?: UserInfo
    size?: number
    clickable?: boolean
    editable?: boolean
}>(), {
    size: 40,
    clickable: false,
    editable: false
})

// Emits定义
const emit = defineEmits<{
    'avatar-saved': [avatarData: any]
}>()

const avatarStore = useAvatarStore()

// 响应式数据
const showAvatarDialog = ref(false)
const saving = ref(false)
const selectedCategory = ref('people')
const selectedEmoji = ref<string>('')
const selectedColor = ref('primary')

// 颜色选项
const colorOptions = ref([
    { name: '主色调', value: 'primary' },
    { name: '次要色', value: 'secondary' },
    { name: '成功绿', value: 'success' },
    { name: '信息蓝', value: 'info' },
    { name: '警告橙', value: 'warning' },
    { name: '错误红', value: 'error' },
    { name: '紫色', value: 'purple' },
    { name: '粉色', value: 'pink' },
    { name: '青色', value: 'cyan' },
    { name: '深紫', value: 'deep-purple' },
    { name: '靛青', value: 'indigo' },
    { name: '蓝色', value: 'blue' },
    { name: '浅蓝', value: 'light-blue' },
    { name: '绿色', value: 'green' },
    { name: '浅绿', value: 'light-green' },
    { name: '黄绿', value: 'lime' },
    { name: '黄色', value: 'yellow' },
    { name: '琥珀', value: 'amber' },
    { name: '橙色', value: 'orange' },
    { name: '深橙', value: 'deep-orange' },
    { name: '棕色', value: 'brown' },
    { name: '灰色', value: 'grey' },
    { name: '蓝灰', value: 'blue-grey' },
    { name: '黑色', value: 'black' }
])

// 计算属性
const displayName = computed(() => {
    return props.user?.nickname || props.user?.email?.split('@')[0] || 'Y'
})

const avatarColor = computed(() => {
    const config = avatarStore.avatarConfig
    return config.color || 'primary'
})

const finalEmojiAvatar = computed(() => {
    const config = avatarStore.avatarConfig

    // 优先显示emoji类型的头像
    if (config.type === 'emoji' && config.emoji) {
        return config.emoji
    }

    // 其次显示fruit类型中保存的emoji
    if (config.type === 'fruit' && config.emoji) {
        return config.emoji
    }

    // 最后尝试fruit到emoji的映射（向后兼容）
    if (config.type === 'fruit' && config.fruit) {
        const fruitEmojis: Record<string, string> = {
            'apple': '🍎',
            'banana': '🍌',
            'orange': '🍊',
            'grape': '🍇',
            'strawberry': '🍓'
        }
        return fruitEmojis[config.fruit] || '🍎'
    }

    return ''
})

const avatarText = computed(() => {
    const name = displayName.value
    return name ? name.charAt(0).toUpperCase() : 'You'
})

const emojiSize = computed(() => {
    return `${props.size * 0.6}px`
})

const textSize = computed(() => {
    return `${props.size * 0.4}px`
})

// 表情头像数据 - 精简版
const emojiCategories = ref([
    {
        name: 'people',
        label: '人物',
        emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😛', '😜', '🤪', '😎', '🤓', '🥳']
    },
    {
        name: 'animals',
        label: '动物',
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦆', '🦄', '🐝']
    },
    {
        name: 'food',
        label: '食物',
        emojis: ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🌽', '🥕', '🥔', '🍠']
    },
    {
        name: 'nature',
        label: '自然',
        emojis: ['🌲', '🌳', '🌴', '🌵', '🌱', '🌿', '🍀', '🌺', '🌻', '🌹', '🌷', '🌼', '🌸', '🌙', '⭐', '🌟', '☀', '🌈', '🔥', '💧']
    },
    {
        name: 'symbols',
        label: '符号',
        emojis: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💎', '🌟', '✨', '⚡', '💥', '💫', '⭐', '🔥', '💧', '🌈', '☀', '🌙']
    }
])

// 当前分类的表情
const currentCategoryEmojis = computed(() => {
    const category = emojiCategories.value.find(cat => cat.name === selectedCategory.value)
    return category?.emojis || []
})

// 方法
const handleAvatarClick = () => {
    if (props.editable) {
        showAvatarDialog.value = true
    }
}

const handleDialogClose = () => {
    showAvatarDialog.value = false
}

const saveAvatar = async () => {
    if (saving.value) return

    saving.value = true
    try {
        let avatarData: any = {
            color: selectedColor.value
        }

        if (selectedEmoji.value) {
            // 直接保存emoji头像
            avatarData.type = 'emoji'
            avatarData.emoji = selectedEmoji.value

            // 使用新的setEmoji方法
            avatarStore.setEmoji(selectedEmoji.value, selectedColor.value)
            console.log('✅ 设置emoji头像:', { emoji: selectedEmoji.value, color: selectedColor.value })
        } else {
            // 保存文字头像
            avatarData.type = 'letter'

            avatarStore.setLetter(selectedColor.value)
            console.log('✅ 设置文字头像:', { type: 'letter', color: selectedColor.value })
        }

        console.log('头像保存成功:', avatarData)
        showAvatarDialog.value = false

        emit('avatar-saved', avatarData)

    } catch (error) {
        console.error('保存头像失败:', error)
    } finally {
        saving.value = false
    }
}

// 修复初始化预览逻辑
const initializePreview = () => {
    const config = avatarStore.avatarConfig
    selectedColor.value = config.color || 'primary'

    // 直接使用保存的emoji
    if (config.emoji) {
        selectedEmoji.value = config.emoji
    } else {
        selectedEmoji.value = ''
    }

    console.log('🔄 初始化头像预览:', {
        config,
        selectedColor: selectedColor.value,
        selectedEmoji: selectedEmoji.value
    })
}

// 监听对话框状态
watch(showAvatarDialog, (newValue) => {
    if (newValue) {
        initializePreview()
        selectedCategory.value = 'people'
    }
})

const selectEmoji = (emoji: string) => {
    selectedEmoji.value = emoji
    console.log('选择表情头像:', emoji)
}

const clearEmoji = () => {
    selectedEmoji.value = ''
    console.log('清除表情头像，使用文字头像')
}

const selectColor = (color: string) => {
    selectedColor.value = color
    console.log('选择颜色:', color)
}
</script>

<style scoped>
.user-avatar-wrapper {
    position: relative;
    display: inline-block;
}

.user-avatar-wrapper.clickable {
    cursor: pointer;
}

.user-avatar {
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar-wrapper:hover .user-avatar {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar-wrapper.clickable:hover .user-avatar {
    border-color: rgba(76, 175, 80, 0.6);
}

/* 预览头像样式 */
.current-avatar-preview {
    padding: 20px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%);
    border-radius: 16px;
    border: 2px solid rgba(76, 175, 80, 0.2);
}

.preview-avatar {
    border: 3px solid #4CAF50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 颜色选择网格 */
.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    background-color: #fafafa;
}

.color-option {
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    border: 2px solid transparent !important;
    transition: all 0.2s ease;
}

.color-option:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-option.selected {
    border-color: #333 !important;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 表情网格 */
.emoji-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 6px;
    max-height: 250px;
    overflow-y: auto;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    background-color: #fafafa;
}

.emoji-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: white;
    border: 2px solid transparent;
}

.emoji-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    transform: scale(1.1);
    border-color: rgba(76, 175, 80, 0.3);
}

.emoji-item.selected {
    background-color: rgba(76, 175, 80, 0.2);
    border-color: #4CAF50;
    transform: scale(1.1);
}

.emoji-item.clear-option {
    background-color: #f5f5f5;
    border-color: #ddd;
}

.emoji-item.clear-option:hover {
    background-color: rgba(158, 158, 158, 0.1);
    border-color: #999;
}

.emoji-item.clear-option.selected {
    background-color: rgba(158, 158, 158, 0.2);
    border-color: #666;
}

.emoji-display {
    font-size: 20px;
    line-height: 1;
}

/* 滚动条样式 */
.color-grid::-webkit-scrollbar,
.emoji-grid::-webkit-scrollbar {
    width: 6px;
}

.color-grid::-webkit-scrollbar-track,
.emoji-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.color-grid::-webkit-scrollbar-thumb,
.emoji-grid::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 3px;
}

.color-grid::-webkit-scrollbar-thumb:hover,
.emoji-grid::-webkit-scrollbar-thumb:hover {
    background: #45a049;
}

/* 响应式调整 */
@media (max-width: 600px) {
    .color-grid {
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 6px;
    }

    .color-option {
        width: 40px !important;
        height: 40px !important;
    }

    .emoji-grid {
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 4px;
    }

    .emoji-item {
        width: 40px;
        height: 40px;
    }

    .emoji-display {
        font-size: 18px;
    }
}
</style>
