<template>
    <v-dialog v-model="showDialog" max-width="600" persistent @click:outside="handleCancel">
        <v-card class="profile-edit-card fruit-card" elevation="12" rounded="xl">
            <!-- 弹窗头部 -->
            <div class="profile-edit-header fruit-gradient">
                <v-card-title class="text-white d-flex align-center">
                    <v-icon color="white" class="mr-3" size="large">mdi-account-edit</v-icon>
                    <span class="text-h5 font-weight-bold">编辑个人资料</span>
                    <v-spacer></v-spacer>
                    <v-btn icon variant="text" @click="handleCancel" class="close-btn">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <div class="subtitle-text text-white pa-4 pt-0">
                    <p class="mb-0 opacity-90">更新您的个人信息以获得更好的体验</p>
                </div>
            </div>

            <!-- 表单内容 -->
            <v-card-text class="pa-6">
                <v-form v-model="formValid" ref="formRef">
                    <v-row>
                        <!-- 昵称 -->
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formData.nickname" label="昵称" prepend-inner-icon="mdi-account"
                                variant="outlined" color="primary" :rules="nicknameRules" maxlength="20" counter
                                class="profile-input" rounded="lg">
                                <template v-slot:append-inner>
                                    <v-btn icon size="small" variant="text" color="primary"
                                        @click="generateRandomNickname" :loading="isGeneratingNickname" title="随机生成昵称">
                                        <v-icon size="20">mdi-dice-6</v-icon>
                                    </v-btn>
                                </template>
                            </v-text-field>
                        </v-col>

                        <!-- 年龄 -->
                        <v-col cols="12" sm="6">
                            <v-text-field v-model.number="formData.age" type="number" label="年龄"
                                prepend-inner-icon="mdi-cake-variant" variant="outlined" color="pink" :rules="ageRules"
                                min="1" max="120" class="profile-input" rounded="lg">
                                <template v-slot:append-inner>
                                    <span class="text-caption text-pink">岁</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <!-- 性别 -->
                        <v-col cols="12">
                            <div class="gender-section">
                                <h4 class="mb-3 d-flex align-center">
                                    <v-icon color="purple" class="mr-2">mdi-human-male-female</v-icon>
                                    性别
                                </h4>
                                <v-radio-group v-model="formData.gender" inline>
                                    <v-row>
                                        <v-col v-for="option in genderOptions" :key="option.value" cols="4">
                                            <v-card class="gender-option-card"
                                                :class="{ 'selected': formData.gender === option.value }"
                                                variant="outlined" rounded="lg" @click="selectGender(option.value)">
                                                <v-card-text class="text-center pa-3">
                                                    <v-radio :value="option.value" color="purple" class="mb-2"
                                                        hide-details></v-radio>
                                                    <div class="gender-icon" :style="{ color: option.color }">
                                                        {{ option.icon }}
                                                    </div>
                                                    <div class="gender-text">{{ option.label }}</div>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-radio-group>
                            </div>
                        </v-col>

                        <!-- 身高 -->
                        <v-col cols="12" sm="6">
                            <v-text-field v-model.number="formData.heightCm" type="number" label="身高"
                                prepend-inner-icon="mdi-human-male-height" variant="outlined" color="blue"
                                :rules="heightRules" min="50" max="250" step="0.1" class="profile-input" rounded="lg">
                                <template v-slot:append-inner>
                                    <span class="text-caption text-blue">cm</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <!-- 体重 -->
                        <v-col cols="12" sm="6">
                            <v-text-field v-model.number="formData.weightKg" type="number" label="体重"
                                prepend-inner-icon="mdi-scale-bathroom" variant="outlined" color="blue"
                                :rules="weightRules" min="10" max="300" step="0.1" class="profile-input" rounded="lg">
                                <template v-slot:append-inner>
                                    <span class="text-caption text-blue">kg</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <!-- BMI 显示 -->
                        <v-col cols="12" v-if="calculatedBMI">
                            <v-card class="bmi-display-card" :color="getBMIColor(calculatedBMI)" variant="elevated"
                                rounded="xl">
                                <v-card-text class="text-center pa-4">
                                    <div class="d-flex align-center justify-center">
                                        <v-icon color="white" class="mr-2" size="large">mdi-chart-line</v-icon>
                                        <div>
                                            <div class="text-h6 text-white mb-1">BMI指数: {{ calculatedBMI }}</div>
                                            <v-chip :color="getBMIChipColor(calculatedBMI)" variant="elevated"
                                                class="text-white font-weight-bold" size="small">
                                                {{ getBMICategory(calculatedBMI) }}
                                            </v-chip>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
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
                <v-btn color="primary" variant="elevated" @click="handleSave" :loading="saving"
                    :disabled="!formValid || !hasChanges" class="action-btn fruit-gradient-btn">
                    <v-icon start color="white">mdi-check</v-icon>
                    <span class="text-white">保存更改</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 提示信息 -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
        {{ snackbarText }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">关闭</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { completeProfile, type CompleteProfileData, type UserInfoVo } from '@/api/profile'
import { NicknameGenerator } from '@/utils/nickname-generator'

// 定义性别类型
type GenderType = 'MALE' | 'FEMALE' | 'UNKNOWN'

// Props
interface Props {
    modelValue: boolean
    userInfo?: UserInfoVo | null
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    userInfo: null
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'profile-updated': [userInfo: UserInfoVo]
}>()

// 响应式数据
const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const formRef = ref()
const formValid = ref(false)
const saving = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const isGeneratingNickname = ref(false)

// 表单数据
const formData = ref<CompleteProfileData>({
    nickname: '',
    age: undefined,
    gender: undefined,
    heightCm: undefined,
    weightKg: undefined,
    isCompleted: true,
    bmiValue: undefined
})

// 原始数据（用于比较是否有变更）
const originalData = ref<CompleteProfileData>()

// 性别选项
const genderOptions = ref<Array<{
    value: GenderType
    label: string
    icon: string
    color: string
}>>([
    { value: 'MALE', label: '男性', icon: '👨', color: '#2196F3' },
    { value: 'FEMALE', label: '女性', icon: '👩', color: '#E91E63' },
    { value: 'UNKNOWN', label: '暂不透露', icon: '🤔', color: '#9E9E9E' }
])

// 验证规则
const nicknameRules = [
    (v: string) => !!v || '请输入昵称',
    (v: string) => v.length <= 20 || '昵称不能超过20个字符'
]

const ageRules = [
    (v: number) => !!v || '请输入年龄',
    (v: number) => v >= 1 && v <= 120 || '请输入有效的年龄'
]

const heightRules = [
    (v: number) => !!v || '请输入身高',
    (v: number) => v >= 50 && v <= 250 || '请输入有效的身高'
]

const weightRules = [
    (v: number) => !!v || '请输入体重',
    (v: number) => v >= 10 && v <= 300 || '请输入有效的体重'
]

// 计算属性
const calculatedBMI = computed(() => {
    if (formData.value.heightCm && formData.value.weightKg) {
        const heightM = formData.value.heightCm / 100
        const bmi = formData.value.weightKg / (heightM * heightM)
        return Math.round(bmi * 10) / 10
    }
    return undefined
})

const hasChanges = computed(() => {
    const current = JSON.stringify(formData.value)
    const original = JSON.stringify(originalData.value)
    return current !== original
})

// 方法
const initializeForm = () => {
    if (props.userInfo) {
        formData.value = {
            nickname: props.userInfo.nickname || '',
            age: props.userInfo.age || undefined,
            gender: props.userInfo.gender || undefined,
            heightCm: props.userInfo.heightCm || undefined,
            weightKg: props.userInfo.weightKg || undefined,
            isCompleted: true,
            bmiValue: props.userInfo.bmiValue || undefined
        }

        // 保存原始数据
        originalData.value = { ...formData.value }
    }
}

const selectGender = (genderValue: GenderType) => {
    formData.value.gender = genderValue
}

const generateRandomNickname = async () => {
    if (isGeneratingNickname.value) return

    isGeneratingNickname.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 200))
        const nickname = NicknameGenerator.generateNickname()
        formData.value.nickname = nickname
        showMessage(`已生成昵称：${nickname}`, 'success')
    } catch (error) {
        console.error('生成昵称失败:', error)
        showMessage('生成昵称失败，请重试', 'error')
    } finally {
        isGeneratingNickname.value = false
    }
}

const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return '偏瘦'
    if (bmi < 24) return '正常'
    if (bmi < 28) return '偏胖'
    return '肥胖'
}

const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'blue'
    if (bmi < 24) return 'success'
    if (bmi < 28) return 'warning'
    return 'error'
}

const getBMIChipColor = (bmi: number) => {
    if (bmi < 18.5) return 'blue'
    if (bmi < 24) return 'success'
    if (bmi < 28) return 'orange'
    return 'red'
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const handleCancel = () => {
    if (hasChanges.value) {
        if (confirm('您有未保存的更改，确定要取消吗？')) {
            showDialog.value = false
            // 恢复原始数据
            initializeForm()
        }
    } else {
        showDialog.value = false
    }
}

const handleSave = async () => {
    if (!formValid.value || saving.value) return

    saving.value = true
    try {
        // 计算BMI
        const bmiValue = calculatedBMI.value

        // 构建提交数据
        const submitData: CompleteProfileData = {
            nickname: formData.value.nickname,
            age: formData.value.age,
            gender: formData.value.gender,
            heightCm: formData.value.heightCm,
            weightKg: formData.value.weightKg,
            isCompleted: true,
            bmiValue: bmiValue
        }

        console.log('🚀 提交个人资料更新:', submitData)

        const response = await completeProfile(submitData)

        if (response.code === 200) {
            showMessage('个人资料更新成功！', 'success')

            // 更新原始数据
            originalData.value = { ...formData.value }

            // 发送更新事件给父组件
            emit('profile-updated', {
                ...props.userInfo!,
                ...submitData
            } as UserInfoVo)

            // 延迟关闭弹窗
            setTimeout(() => {
                showDialog.value = false
            }, 1000)
        } else {
            showMessage(response.msg || '更新失败，请重试', 'error')
        }
    } catch (error: any) {
        console.error('❌ 更新个人资料失败:', error)

        let message = '更新失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message) {
            message = error.message
        }

        showMessage(message, 'error')
    } finally {
        saving.value = false
    }
}

// 监听弹窗状态，初始化表单
watch(showDialog, (newValue) => {
    if (newValue) {
        initializeForm()
    }
})
</script>

<style scoped>
.profile-edit-card {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(20px);
}

.profile-edit-header {
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

.profile-input :deep(.v-field--focused) {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3) !important;
}

.gender-section {
    margin-top: 8px;
}

.gender-option-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent !important;
}

.gender-option-card:hover {
    border-color: #9C27B0 !important;
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2) !important;
    transform: translateY(-2px);
}

.gender-option-card.selected {
    border-color: #9C27B0 !important;
    background: rgba(156, 39, 176, 0.05) !important;
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3) !important;
}

.gender-icon {
    font-size: 24px;
    margin-bottom: 4px;
}

.gender-text {
    font-size: 14px;
    font-weight: 500;
}

.bmi-display-card {
    transition: all 0.3s ease;
}

.action-btn {
    min-width: 100px;
    height: 44px !important;
    font-weight: 600 !important;
}

/* 动画效果 */
.v-dialog>.v-overlay__content {
    animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* 移动端适配 */
@media (max-width: 600px) {
    .profile-edit-card {
        margin: 16px;
    }

    .gender-option-card {
        margin-bottom: 8px;
    }
}
</style>
