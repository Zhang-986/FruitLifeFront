<template>
    <v-dialog v-model="showDialog" max-width="900" persistent scrollable>
        <v-card class="fruit-edit-card" elevation="12" rounded="xl">
            <!-- 弹窗头部 -->
            <div class="edit-header fruit-gradient">
                <v-card-title class="text-white d-flex align-center">
                    <v-icon color="white" class="mr-3" size="large">
                        {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
                    </v-icon>
                    <span class="text-h5 font-weight-bold">
                        {{ isEdit ? '编辑水果信息' : '添加新水果' }}
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn icon variant="text" @click="handleCancel" class="close-btn">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
            </div>

            <!-- 表单内容 -->
            <v-card-text class="pa-6" style="max-height: 700px;">
                <v-form v-model="formValid" ref="formRef">
                    <v-row>
                        <!-- 基本信息 -->
                        <v-col cols="12">
                            <h3 class="section-title mb-4">
                                <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                                基本信息
                            </h3>
                        </v-col>

                        <!-- 水果名称 -->
                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.name" label="水果名称 *" prepend-inner-icon="mdi-fruit-cherries"
                                variant="outlined" color="primary" :rules="nameRules" maxlength="50" counter
                                rounded="lg" />
                        </v-col>

                        <!-- 口味特征 -->
                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.flavorProfile" label="口味特征"
                                prepend-inner-icon="mdi-emoticon-tongue" variant="outlined" color="pink"
                                placeholder="例如：酸甜、清爽、醇厚" rounded="lg" />
                        </v-col>

                        <!-- 水果描述 -->
                        <v-col cols="12">
                            <v-textarea v-model="formData.description" label="水果描述" prepend-inner-icon="mdi-text"
                                variant="outlined" color="primary" rows="3" maxlength="500" counter rounded="lg" />
                        </v-col>

                        <!-- 营养概览 -->
                        <v-col cols="12">
                            <v-text-field v-model="formData.nutritionSummary" label="营养概览"
                                prepend-inner-icon="mdi-nutrition" variant="outlined" color="success"
                                placeholder="例如：富含维生素C和膳食纤维" rounded="lg" />
                        </v-col>

                        <!-- 图片和应季信息 -->
                        <v-col cols="12" md="8">
                            <v-text-field v-model="formData.imageUrl" label="图片URL" prepend-inner-icon="mdi-image"
                                variant="outlined" color="blue" placeholder="请输入图片链接或点击自动获取" rounded="lg">
                                <template v-slot:append>
                                    <v-btn color="primary" variant="text" size="small" @click="autoGetImage"
                                        :loading="loadingImage">
                                        <v-icon start size="small">mdi-auto-fix</v-icon>
                                        自动获取
                                    </v-btn>
                                </template>
                            </v-text-field>

                            <!-- 图片预览 -->
                            <div v-if="formData.imageUrl" class="mt-2">
                                <v-img :src="formData.imageUrl" :alt="formData.name" height="120" width="200" cover
                                    rounded="lg" class="image-preview">
                                    <template v-slot:placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </div>
                                    </template>
                                    <template v-slot:error>
                                        <div class="d-flex align-center justify-center fill-height text-red">
                                            <v-icon>mdi-image-broken-variant</v-icon>
                                            <span class="ml-2">图片加载失败</span>
                                        </div>
                                    </template>
                                </v-img>
                                <div class="text-caption text-grey mt-1" v-if="imageInfo">
                                    来源: {{ getImageSourceText(imageInfo.source) }}
                                    <span v-if="imageInfo.author"> - {{ imageInfo.author }}</span>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="formData.seasonInfo" label="应季信息" prepend-inner-icon="mdi-calendar"
                                variant="outlined" color="orange" :items="seasonOptions" rounded="lg" />
                        </v-col>

                        <!-- 生活属性标签 -->
                        <v-col cols="12">
                            <h3 class="section-title mb-4">
                                <v-icon color="success" class="mr-2">mdi-tag-multiple</v-icon>
                                生活属性标签
                            </h3>
                            <v-combobox v-model="lifePropertiesArray" label="生活属性" prepend-inner-icon="mdi-tag"
                                variant="outlined" color="success" multiple chips closable-chips
                                :items="propertyOptions" placeholder="选择或输入属性标签" rounded="lg" />
                        </v-col>

                        <!-- 详细信息 -->
                        <v-col cols="12">
                            <h3 class="section-title mb-4">
                                <v-icon color="info" class="mr-2">mdi-book-open</v-icon>
                                详细信息
                            </h3>
                        </v-col>

                        <!-- 挑选技巧 -->
                        <v-col cols="12" md="6">
                            <v-textarea v-model="formData.selectionTips" label="挑选技巧" prepend-inner-icon="mdi-eye-check"
                                variant="outlined" color="info" rows="3" placeholder="例如：颜色鲜亮，表皮无斑点" rounded="lg" />
                        </v-col>

                        <!-- 储存方法 -->
                        <v-col cols="12" md="6">
                            <v-textarea v-model="formData.storageTips" label="储存方法" prepend-inner-icon="mdi-fridge"
                                variant="outlined" color="blue" rows="3" placeholder="例如：常温保存，避免阳光直射" rounded="lg" />
                        </v-col>

                        <!-- 食用禁忌 - 新增字段 -->
                        <v-col cols="12" md="6">
                            <v-textarea v-model="formData.eatingTaboos" label="食用禁忌"
                                prepend-inner-icon="mdi-alert-circle" variant="outlined" color="warning" rows="3"
                                placeholder="例如：不宜与海鲜同食，空腹不宜多食" rounded="lg" />
                        </v-col>

                        <!-- 文化寓意 - 新增字段 -->
                        <v-col cols="12" md="6">
                            <v-textarea v-model="formData.culturalSignificance" label="文化寓意"
                                prepend-inner-icon="mdi-account-group" variant="outlined" color="purple" rows="3"
                                placeholder="例如：苹果在中国文化中象征平安，寓意吉祥如意" rounded="lg" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <!-- 操作按钮 -->
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-btn variant="outlined" color="grey" @click="handleCancel" class="action-btn">
                    <v-icon start>mdi-close</v-icon>
                    取消
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="handleSave" :loading="saving" :disabled="!formValid"
                    class="action-btn fruit-gradient-btn">
                    <v-icon start color="white">mdi-check</v-icon>
                    <span class="text-white">{{ isEdit ? '更新' : '添加' }}</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { addFruit, updateFruit, type Fruit } from '@/api/fruit'
import { getFruitImage, type ImageInfo, getPresetFruitImages } from '@/utils/image-api'

// Props
interface Props {
    modelValue: boolean
    fruit?: Fruit | null
    isEdit: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    fruit: null,
    isEdit: false
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'fruit-saved': [fruit: Fruit]
}>()

// 响应式数据
const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const formRef = ref()
const formValid = ref(false)
const saving = ref(false)

// 表单数据 - 使用与后端一致的字段类型
const formData = ref<Fruit>({
    name: '',
    description: '',
    nutritionSummary: '',
    flavorProfile: '',
    imageUrl: '',
    seasonInfo: '',
    selectionTips: '',
    storageTips: '',
    eatingTaboos: '',          // 新增字段
    culturalSignificance: '',  // 新增字段
    lifeProperties: ''         // 现在是字符串类型
})

// 用于界面展示的数组类型属性
const lifePropertiesArray = ref<string[]>([])

// 选项数据 - 扩展生活属性选项
const seasonOptions = ['春季', '夏季', '秋季', '冬季', '全年']
const propertyOptions = [
    '解暑', '清热', '适合甜点', '促进食欲', '美容养颜', '增强免疫力',
    '补充体力', '缓解便秘', '改善心情', '促进消化', '降血压', '抗氧化',
    '润肺止咳', '护眼明目', '补血养颜', '健脾开胃', '滋阴润燥', '清肝明目',
    '安神助眠', '减肥瘦身', '抗衰老', '增强体质', '生津止渴', '化痰止咳'
]

// 验证规则
const nameRules = [
    (v: string) => !!v || '请输入水果名称',
    (v: string) => v.length <= 50 || '水果名称不能超过50个字符'
]

// 新增状态
const loadingImage = ref(false)
const imageInfo = ref<ImageInfo | null>(null)

// 预设图片映射
const presetImages = getPresetFruitImages()

// 方法
const initializeForm = () => {
    if (props.fruit) {
        formData.value = {
            ...props.fruit,
            // 确保所有字段都有值
            description: props.fruit.description || '',
            nutritionSummary: props.fruit.nutritionSummary || '',
            flavorProfile: props.fruit.flavorProfile || '',
            imageUrl: props.fruit.imageUrl || '',
            seasonInfo: props.fruit.seasonInfo || '',
            selectionTips: props.fruit.selectionTips || '',
            storageTips: props.fruit.storageTips || '',
            eatingTaboos: props.fruit.eatingTaboos || '',
            culturalSignificance: props.fruit.culturalSignificance || '',
            lifeProperties: props.fruit.lifeProperties || ''
        }

        // 解析生活属性字符串为数组用于界面展示
        try {
            if (props.fruit.lifeProperties && props.fruit.lifeProperties.trim()) {
                lifePropertiesArray.value = JSON.parse(props.fruit.lifeProperties)
            } else {
                lifePropertiesArray.value = []
            }
        } catch (error) {
            console.error('解析生活属性失败:', error)
            lifePropertiesArray.value = []
        }
    } else {
        formData.value = {
            name: '',
            description: '',
            nutritionSummary: '',
            flavorProfile: '',
            imageUrl: '',
            seasonInfo: '',
            selectionTips: '',
            storageTips: '',
            eatingTaboos: '',
            culturalSignificance: '',
            lifeProperties: ''
        }
        lifePropertiesArray.value = []
    }
}

const handleCancel = () => {
    showDialog.value = false
}

const handleSave = async () => {
    if (!formValid.value || saving.value) return

    saving.value = true
    try {
        // 将数组转换为JSON字符串
        const lifePropertiesJson = lifePropertiesArray.value.length > 0
            ? JSON.stringify(lifePropertiesArray.value)
            : ''

        const submitData: Fruit = {
            ...formData.value,
            description: formData.value.description || '',
            nutritionSummary: formData.value.nutritionSummary || '',
            flavorProfile: formData.value.flavorProfile || '',
            imageUrl: formData.value.imageUrl || '',
            seasonInfo: formData.value.seasonInfo || '',
            selectionTips: formData.value.selectionTips || '',
            storageTips: formData.value.storageTips || '',
            eatingTaboos: formData.value.eatingTaboos || '',
            culturalSignificance: formData.value.culturalSignificance || '',
            lifeProperties: lifePropertiesJson // 转换为JSON字符串
        }

        console.log('💾 提交数据:', submitData)

        if (props.isEdit) {
            const response = await updateFruit(submitData)
            if (response.code === 200) {
                emit('fruit-saved', submitData)
                showDialog.value = false
            }
        } else {
            const response = await addFruit(submitData)
            if (response.code === 200) {
                emit('fruit-saved', submitData)
                showDialog.value = false
            }
        }
    } catch (error) {
        console.error('保存水果失败:', error)
    } finally {
        saving.value = false
    }
}

// 自动获取图片方法
const autoGetImage = async () => {
    if (!formData.value.name.trim()) {
        showMessage('请先输入水果名称', 'warning')
        return
    }

    loadingImage.value = true

    try {
        // 首先尝试使用预设图片
        if (presetImages[formData.value.name]) {
            formData.value.imageUrl = presetImages[formData.value.name]
            imageInfo.value = {
                url: presetImages[formData.value.name],
                thumbnailUrl: presetImages[formData.value.name],
                description: `${formData.value.name}图片`,
                source: 'unsplash'
            }
            showMessage(`已设置${formData.value.name}的预设图片`, 'success')
            return
        }

        // 如果没有预设图片，调用API获取
        const result = await getFruitImage(formData.value.name)

        if (result) {
            formData.value.imageUrl = result.url
            imageInfo.value = result
            showMessage(`成功获取${formData.value.name}的图片`, 'success')
        } else {
            showMessage('未找到合适的图片，请手动输入URL', 'warning')
        }
    } catch (error) {
        console.error('获取图片失败:', error)
        showMessage('获取图片失败，请手动输入URL', 'error')
    } finally {
        loadingImage.value = false
    }
}

// 获取图片来源文本
const getImageSourceText = (source: string) => {
    const sourceMap: Record<string, string> = {
        'unsplash': 'Unsplash',
        'pixabay': 'Pixabay',
        'pexels': 'Pexels',
        'placeholder': '占位图'
    }
    return sourceMap[source] || '未知来源'
}

// 监听水果名称变化，自动获取图片（可选）
watch(() => formData.value.name, (newName) => {
    // 如果当前没有图片URL且水果名称不为空，可以自动获取
    if (newName && !formData.value.imageUrl && !props.isEdit) {
        // 延迟一下避免频繁调用
        setTimeout(() => {
            if (presetImages[newName]) {
                formData.value.imageUrl = presetImages[newName]
            }
        }, 500)
    }
})

// 添加消息提示方法
const showMessage = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    // 这里可以使用你现有的消息提示系统
    console.log(`${type.toUpperCase()}: ${message}`)
}

// 监听弹窗状态，初始化表单
watch(showDialog, (newValue) => {
    if (newValue) {
        initializeForm()
    }
})
</script>

<style scoped>
.fruit-edit-card {
    background: rgba(255, 255, 255, 0.98) !important;
}

.edit-header {
    border-radius: 24px 24px 0 0;
}

.fruit-gradient {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.fruit-gradient-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px);
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.action-btn {
    min-width: 100px;
    height: 44px !important;
    font-weight: 600 !important;
}

.image-preview {
    border: 2px solid #e0e0e0;
    transition: border-color 0.3s ease;
}

.image-preview:hover {
    border-color: #4CAF50;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .fruit-edit-card {
        margin: 16px;
    }
}
</style>
