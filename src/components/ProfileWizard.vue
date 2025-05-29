<template>
    <!-- 全屏遮罩弹窗 -->
    <v-dialog v-model="showDialog" persistent fullscreen transition="dialog-bottom-transition">
        <!-- 添加渐变背景容器 -->
        <div class="wizard-background">
            <v-card class="wizard-container">
                <!-- 顶部进度条 - 增强设计 -->
                <div class="wizard-header">
                    <!-- 步骤指示器 -->
                    <div class="steps-indicator">
                        <div v-for="step in 7" :key="step" class="step-indicator"
                            :class="{ 'active': step - 1 <= currentStep, 'completed': step - 1 < currentStep }">
                            <div class="step-circle">
                                <v-icon v-if="step - 1 < currentStep" size="small" color="white">mdi-check</v-icon>
                                <span v-else class="step-number">{{ step }}</span>
                            </div>
                        </div>
                    </div>

                    <v-progress-linear :model-value="progress" :color="getProgressColor()" height="6" rounded
                        class="progress-bar">
                    </v-progress-linear>

                    <v-btn icon variant="text" @click="handleClose" class="close-btn">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </div>

                <!-- 主内容区域 -->
                <div class="wizard-content">
                    <v-container class="fill-height">
                        <v-row justify="center" align="center" class="fill-height">
                            <v-col cols="12" sm="8" md="6" lg="4">
                                <!-- 步骤容器 - 添加动画效果 -->
                                <transition :name="transitionName" mode="out-in" @enter="onEnter" @leave="onLeave">
                                    <!-- 欢迎步骤 -->
                                    <div v-if="currentStep === 0" key="step-0" class="step-content text-center">
                                        <v-card class="welcome-card fruit-gradient-orange" elevation="12" rounded="xl">
                                            <v-card-text class="pa-8">
                                                <div class="welcome-icon animate-bounce">🍎</div>
                                                <h1 class="wizard-title text-white animate-fade-in">欢迎加入水果生活！</h1>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    让我们花2分钟时间了解您，为您推荐最适合的水果</p>
                                                <v-btn color="white" variant="elevated" size="large" rounded="xl"
                                                    @click="nextStep" class="mt-6 animate-slide-up start-btn">
                                                    <span class="text-primary font-weight-bold">开始设置</span>
                                                    <v-icon end color="primary">mdi-arrow-right</v-icon>
                                                </v-btn>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第1步：昵称 -->
                                    <div v-else-if="currentStep === 1" key="step-1" class="step-content">
                                        <v-card class="step-card" elevation="8" rounded="xl">
                                            <div class="step-header fruit-gradient">
                                                <h2 class="wizard-title text-white animate-fade-in">您希望我们怎么称呼您？</h2>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    一个好听的昵称让交流更亲切</p>
                                            </div>
                                            <v-card-text class="pa-6">
                                                <v-text-field v-model="formData.nickname" label="请输入您的昵称"
                                                    variant="outlined" color="primary"
                                                    class="mt-4 animate-slide-up nickname-input" maxlength="20" counter
                                                    :rules="nicknameRules" prepend-inner-icon="mdi-account"
                                                    @keyup.enter="nextStep">

                                                    <!-- 简化骰子按钮 - 直接生成 -->
                                                    <template v-slot:append-inner>
                                                        <v-btn icon size="small" variant="text" color="primary"
                                                            :loading="isGeneratingNickname"
                                                            @click="generateRandomNickname" class="nickname-dice-btn"
                                                            title="随机生成昵称">
                                                            <v-icon size="20" class="dice-icon">mdi-dice-6</v-icon>
                                                        </v-btn>
                                                    </template>
                                                </v-text-field>

                                                <!-- 昵称提示 -->
                                                <div class="nickname-tips animate-fade-in-delay">
                                                    <v-icon color="info" size="small"
                                                        class="mr-1">mdi-information</v-icon>
                                                    <span class="text-caption text-medium-emphasis">
                                                        点击 <v-icon size="16" color="primary">mdi-dice-6</v-icon>
                                                        随机生成有趣的昵称
                                                    </span>
                                                </div>

                                                <!-- 显示最近生成的昵称历史 -->
                                                <transition name="fade">
                                                    <div v-if="recentNicknames.length > 0"
                                                        class="recent-nicknames animate-fade-in-delay">
                                                        <div class="recent-nicknames-header">
                                                            <v-icon color="primary" size="small"
                                                                class="mr-1">mdi-history</v-icon>
                                                            <span
                                                                class="text-caption text-medium-emphasis">最近生成的昵称（点击使用）:</span>
                                                        </div>
                                                        <div class="recent-nicknames-list">
                                                            <v-chip v-for="(nickname, index) in recentNicknames"
                                                                :key="index" size="small" variant="outlined"
                                                                color="primary" class="recent-nickname-chip"
                                                                @click="selectRecentNickname(nickname)">
                                                                {{ nickname }}
                                                            </v-chip>
                                                        </div>
                                                    </div>
                                                </transition>

                                                <div class="step-actions animate-slide-up-delay">
                                                    <v-btn variant="outlined" color="primary" @click="prevStep"
                                                        class="action-btn">
                                                        <v-icon start>mdi-arrow-left</v-icon>
                                                        上一步
                                                    </v-btn>
                                                    <v-btn class="fruit-gradient-btn" @click="nextStep"
                                                        :disabled="!formData.nickname" variant="elevated">
                                                        下一步
                                                        <v-icon end color="white">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第2步：年龄 -->
                                    <div v-else-if="currentStep === 2" key="step-2" class="step-content">
                                        <v-card class="step-card" elevation="8" rounded="xl">
                                            <div class="step-header fruit-gradient-pink">
                                                <h2 class="wizard-title text-white animate-fade-in">您的年龄是？</h2>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    这有助于我们推荐适合您的健康水果</p>
                                            </div>
                                            <v-card-text class="pa-6">
                                                <v-text-field v-model.number="formData.age" type="number"
                                                    label="请输入您的年龄" variant="outlined" color="pink"
                                                    class="mt-4 animate-slide-up age-input" min="1" max="120"
                                                    :rules="ageRules" prepend-inner-icon="mdi-cake-variant"
                                                    @keyup.enter="nextStep">
                                                    <template v-slot:append-inner>
                                                        <span class="text-caption text-pink">岁</span>
                                                    </template>
                                                </v-text-field>

                                                <div class="step-actions animate-slide-up-delay">
                                                    <v-btn variant="outlined" color="pink" @click="prevStep"
                                                        class="action-btn">
                                                        <v-icon start>mdi-arrow-left</v-icon>
                                                        上一步
                                                    </v-btn>
                                                    <v-btn class="fruit-gradient-pink-btn" @click="nextStep"
                                                        :disabled="!isValidAge" variant="elevated">
                                                        下一步
                                                        <v-icon end color="white">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第3步：性别 -->
                                    <div v-else-if="currentStep === 3" key="step-3" class="step-content">
                                        <v-card class="step-card" elevation="8" rounded="xl">
                                            <div class="step-header fruit-gradient-purple">
                                                <h2 class="wizard-title text-white animate-fade-in">您的性别是？</h2>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    帮助我们提供更个性化的营养建议</p>
                                            </div>
                                            <v-card-text class="pa-6">
                                                <v-radio-group v-model="formData.gender" class="mt-4 animate-slide-up">
                                                    <v-card v-for="option in genderOptions" :key="option.value"
                                                        class="gender-card animate-item"
                                                        :class="{ 'selected': formData.gender === option.value }"
                                                        variant="outlined" rounded="lg"
                                                        @click="selectGender(option.value)">
                                                        <v-card-text class="pa-4">
                                                            <div class="d-flex align-center">
                                                                <v-radio :value="option.value" color="purple"
                                                                    class="me-3" hide-details>
                                                                </v-radio>
                                                                <div class="gender-option">
                                                                    <div class="gender-icon"
                                                                        :style="{ color: option.color }">
                                                                        {{ option.icon }}
                                                                    </div>
                                                                    <span class="gender-text">{{ option.label }}</span>
                                                                </div>
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-radio-group>

                                                <div class="step-actions animate-slide-up-delay">
                                                    <v-btn variant="outlined" color="purple" @click="prevStep"
                                                        class="action-btn">
                                                        <v-icon start>mdi-arrow-left</v-icon>
                                                        上一步
                                                    </v-btn>
                                                    <v-btn class="fruit-gradient-purple-btn" @click="nextStep"
                                                        :disabled="!formData.gender" variant="elevated">
                                                        下一步
                                                        <v-icon end color="white">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第4步：身高体重 -->
                                    <div v-else-if="currentStep === 4" key="step-4" class="step-content">
                                        <v-card class="step-card" elevation="8" rounded="xl">
                                            <div class="step-header fruit-gradient-blue">
                                                <h2 class="wizard-title text-white animate-fade-in">您的身高和体重是？</h2>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    我们将计算您的BMI指数，推荐合适的水果</p>
                                            </div>
                                            <v-card-text class="pa-6">
                                                <v-row class="mt-4 animate-slide-up">
                                                    <v-col cols="6">
                                                        <v-text-field v-model.number="formData.heightCm" type="number"
                                                            label="身高" variant="outlined" color="blue" min="50"
                                                            max="250" step="0.1" :rules="heightRules"
                                                            prepend-inner-icon="mdi-human-male-height"
                                                            @input="console.log('身高输入:', formData.heightCm)">
                                                            <template v-slot:append-inner>
                                                                <span class="text-caption text-blue">cm</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field v-model.number="formData.weightKg" type="number"
                                                            label="体重" variant="outlined" color="blue" min="10"
                                                            max="300" step="0.1" :rules="weightRules"
                                                            prepend-inner-icon="mdi-scale-bathroom"
                                                            @input="console.log('体重输入:', formData.weightKg)">
                                                            <template v-slot:append-inner>
                                                                <span class="text-caption text-blue">kg</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>

                                                <!-- BMI 预览 - 增强设计 -->
                                                <transition name="bmi-appear" mode="out-in">
                                                    <v-card v-if="calculatedBMI" key="bmi-card"
                                                        class="mt-4 animate-scale-in bmi-card"
                                                        :color="getBMIColor(calculatedBMI)" variant="elevated"
                                                        rounded="xl">
                                                        <v-card-text class="text-center pa-6">
                                                            <div class="bmi-icon">📊</div>
                                                            <div class="text-h6 text-white mb-2">您的BMI指数</div>
                                                            <div class="text-h3 font-weight-bold text-white mb-2">{{
                                                                calculatedBMI }}</div>
                                                            <v-chip :color="getBMIChipColor(calculatedBMI)"
                                                                variant="elevated" class="text-white font-weight-bold">
                                                                {{ getBMICategory(calculatedBMI) }}
                                                            </v-chip>
                                                        </v-card-text>
                                                    </v-card>
                                                </transition>



                                                <div class="step-actions animate-slide-up-delay">
                                                    <v-btn variant="outlined" color="blue" @click="prevStep"
                                                        class="action-btn">
                                                        <v-icon start>mdi-arrow-left</v-icon>
                                                        上一步
                                                    </v-btn>
                                                    <v-btn class="fruit-gradient-blue-btn" @click="nextStep"
                                                        :disabled="!isValidBodyData" variant="elevated">
                                                        下一步
                                                        <v-icon end color="white">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第5步：确认提交 -->
                                    <div v-else-if="currentStep === 5" key="step-5" class="step-content">
                                        <v-card class="step-card" elevation="8" rounded="xl">
                                            <div class="step-header fruit-gradient-green">
                                                <h2 class="wizard-title text-white animate-fade-in">确认您的资料</h2>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">请检查以下信息是否正确
                                                </p>
                                            </div>
                                            <v-card-text class="pa-6">
                                                <v-card class="mt-4 animate-scale-in info-summary-card"
                                                    variant="outlined" rounded="xl">
                                                    <v-card-text class="pa-6">
                                                        <v-row>
                                                            <v-col cols="6" class="animate-item">
                                                                <div class="info-item">
                                                                    <v-icon color="primary"
                                                                        class="mb-2">mdi-account</v-icon>
                                                                    <div class="info-label">昵称</div>
                                                                    <div class="info-value text-primary">{{
                                                                        formData.nickname }}</div>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="6" class="animate-item">
                                                                <div class="info-item">
                                                                    <v-icon color="pink"
                                                                        class="mb-2">mdi-cake-variant</v-icon>
                                                                    <div class="info-label">年龄</div>
                                                                    <div class="info-value text-pink">{{ formData.age
                                                                    }}岁</div>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="6" class="animate-item">
                                                                <div class="info-item">
                                                                    <v-icon :color="getGenderColor(formData.gender)"
                                                                        class="mb-2">{{
                                                                            getGenderIcon(formData.gender) }}</v-icon>
                                                                    <div class="info-label">性别</div>
                                                                    <div class="info-value"
                                                                        :class="`text-${getGenderColor(formData.gender)}`">
                                                                        {{
                                                                            getGenderText(formData.gender) }}</div>
                                                                </div>
                                                            </v-col>
                                                            <v-col cols="6" class="animate-item">
                                                                <div class="info-item">
                                                                    <v-icon color="blue"
                                                                        class="mb-2">mdi-human-male-height</v-icon>
                                                                    <div class="info-label">身高体重</div>
                                                                    <div class="info-value text-blue">{{
                                                                        formData.heightCm }}cm / {{ formData.weightKg
                                                                        }}kg
                                                                    </div>
                                                                </div>
                                                            </v-col>
                                                        </v-row>

                                                        <!-- BMI 显示 -->
                                                        <v-row v-if="calculatedBMI">
                                                            <v-col cols="12" class="animate-item">
                                                                <v-divider class="my-3"></v-divider>
                                                                <div class="info-item">
                                                                    <v-icon color="success"
                                                                        class="mb-2">mdi-chart-line</v-icon>
                                                                    <div class="info-label">BMI指数</div>
                                                                    <div class="info-value text-success">{{
                                                                        calculatedBMI }} ({{
                                                                            getBMICategory(calculatedBMI) }})</div>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>



                                                <div class="step-actions animate-slide-up-delay">
                                                    <v-btn variant="outlined" color="green" @click="prevStep"
                                                        class="action-btn">
                                                        <v-icon start>mdi-pencil</v-icon>
                                                        修改资料
                                                    </v-btn>
                                                    <v-btn class="fruit-gradient-green-btn" @click="submitProfile"
                                                        :loading="submitting" variant="elevated">
                                                        完成设置
                                                        <v-icon end color="white">mdi-check</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <!-- 第6步：完成 -->
                                    <div v-else-if="currentStep === 6" key="step-6" class="step-content text-center">
                                        <v-card class="success-card fruit-gradient" elevation="12" rounded="xl">
                                            <v-card-text class="pa-8">
                                                <div class="success-icon animate-bounce">🎉</div>
                                                <h1 class="wizard-title text-white animate-fade-in">资料完善成功！</h1>
                                                <p class="wizard-subtitle text-white animate-fade-in-delay">
                                                    您的个人资料已成功保存，现在可以享受个性化的水果推荐了</p>
                                                <v-btn color="white" variant="elevated" size="large" rounded="xl"
                                                    @click="finishWizard" class="mt-6 animate-slide-up finish-btn">
                                                    <span class="text-primary font-weight-bold">开始探索</span>
                                                    <v-icon end color="primary">mdi-rocket-launch</v-icon>
                                                </v-btn>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </transition>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-card>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { completeProfile, type CompleteProfileData } from '@/api/profile'
import { NicknameGenerator } from '@/utils/nickname-generator'

// Props
interface Props {
    modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'completed': []
    'close-attempt': []
}>()

// 定义性别类型
type GenderType = 'MALE' | 'FEMALE' | 'UNKNOWN'

// 响应式数据
const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const currentStep = ref(0)
const submitting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const isDev = computed(() => import.meta.env.DEV)

// 表单数据 - 修复字段名映射
const formData = ref<CompleteProfileData>({
    nickname: '',
    age: undefined,
    gender: undefined,
    heightCm: undefined,  // 修复：使用正确的字段名
    weightKg: undefined,  // 修复：使用正确的字段名
    isCompleted: false,   // 修复：使用正确的字段名和类型
    bmiValue: undefined   // 修复：使用正确的字段名
})

// 性别选项数据 - 使用明确的类型
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

// 计算属性
const progress = computed(() => (currentStep.value / 6) * 100)

// 计算属性 - 修复字段名引用
const calculatedBMI = computed(() => {
    if (formData.value.heightCm && formData.value.weightKg) {
        const heightM = formData.value.heightCm / 100
        const bmi = formData.value.weightKg / (heightM * heightM)
        return Math.round(bmi * 10) / 10
    }
    return undefined
})

const isValidAge = computed(() => {
    return formData.value.age && formData.value.age >= 1 && formData.value.age <= 120
})

const isValidBodyData = computed(() => {
    return formData.value.heightCm && formData.value.weightKg &&
        formData.value.heightCm >= 50 && formData.value.heightCm <= 250 &&
        formData.value.weightKg >= 10 && formData.value.weightKg <= 300
})

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

// 新增动画相关数据
const transitionName = ref('slide-right')

// 方法
const nextStep = () => {
    if (currentStep.value < 6) {
        transitionName.value = 'slide-left'
        currentStep.value++
    }
}

const prevStep = () => {
    if (currentStep.value > 0) {
        transitionName.value = 'slide-right'
        currentStep.value--
    }
}

const handleClose = () => {
    console.log('🔘 ProfileWizard handleClose 被调用，当前步骤:', currentStep.value)

    if (currentStep.value === 0) {
        // 在欢迎步骤，直接关闭
        console.log('📱 在欢迎步骤，直接关闭弹窗')
        showDialog.value = false
    } else if (currentStep.value === 6) {
        // 已完成，直接关闭
        console.log('✅ 已完成，直接关闭弹窗')
        showDialog.value = false
    } else {
        // 在中间步骤，触发关闭确认（使用自定义对话框，不触发浏览器弹窗）
        console.log('⚠️ 在中间步骤，触发自定义关闭确认')
        emit('close-attempt')
    }
}

const resetForm = () => {
    currentStep.value = 0
    formData.value = {
        nickname: '',
        age: undefined,
        gender: undefined,
        heightCm: undefined,  // 修复：使用正确的字段名
        weightKg: undefined,  // 修复：使用正确的字段名
        isCompleted: false,   // 修复：使用正确的字段名和类型
        bmiValue: undefined   // 修复：使用正确的字段名
    }
}

const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const getGenderText = (gender?: string) => {
    switch (gender) {
        case 'MALE': return '男性'
        case 'FEMALE': return '女性'
        case 'UNKNOWN': return '暂不透露'
        default: return ''
    }
}

const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return '偏瘦'
    if (bmi < 24) return '正常'
    if (bmi < 28) return '偏胖'
    return '肥胖'
}

const submitProfile = async () => {
    try {
        submitting.value = true

        // 计算BMI并标记完成
        const bmiValue = calculatedBMI.value

        // 构建正确的提交数据
        const submitData: CompleteProfileData = {
            nickname: formData.value.nickname,
            age: formData.value.age,
            gender: formData.value.gender,
            heightCm: formData.value.heightCm,
            weightKg: formData.value.weightKg,
            isCompleted: true,  // 设置为已完成
            bmiValue: bmiValue
        }

        console.log('🚀 提交完善资料数据:', submitData)
        console.log('📍 请求将发送到: POST /api/user/completeProfile')

        // 显示详细的请求信息
        if (isDev.value) {
            console.group('📋 完善资料请求详情')
            console.log('接口路径: /api/user/completeProfile')
            console.log('请求方法: POST')
            console.log('请求体:', JSON.stringify(submitData, null, 2))
            console.log('后端期望的字段:')
            console.table({
                '字段名': 'nickname, age, gender, heightCm, weightKg, isCompleted, bmiValue',
                '数据类型': 'String, Integer, String, Double, Double, Boolean, Double',
                '当前值': `${submitData.nickname}, ${submitData.age}, ${submitData.gender}, ${submitData.heightCm}, ${submitData.weightKg}, ${submitData.isCompleted}, ${submitData.bmiValue}`
            })
            console.groupEnd()
        }

        const response = await completeProfile(submitData)

        console.log('📦 后端响应:', response)

        if (response.code === 200) {
            currentStep.value = 6
            showMessage('资料提交成功！', 'success')
            console.log('✅ 个人资料完善成功')
        } else {
            console.error('❌ 后端返回错误:', response)
            showMessage(response.msg || '提交失败，请重试', 'error')
        }
    } catch (error: any) {
        console.error('❌ 提交资料失败:', error)

        // 详细的错误信息
        if (isDev.value) {
            console.group('🚨 完善资料错误详情')
            console.log('错误类型:', error.name)
            console.log('错误消息:', error.message)
            console.log('错误对象:', error)
            if (error.response) {
                console.log('HTTP状态:', error.response.status)
                console.log('响应数据:', error.response.data)
            }
            console.groupEnd()
        }

        let message = '提交失败，请稍后重试'

        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message) {
            message = error.message
        }

        showMessage(message, 'error')
    } finally {
        submitting.value = false
    }
}

const finishWizard = () => {
    showDialog.value = false
    emit('completed')
    resetForm()
}

// 新增动画方法
const onEnter = (el: Element) => {
    // 为列表项添加延迟动画
    const items = el.querySelectorAll('.animate-item')
    items.forEach((item, index) => {
        (item as HTMLElement).style.animationDelay = `${index * 0.1}s`
    })
}

const onLeave = () => {
    // 清理动画延迟
}

// 颜色相关方法
const getProgressColor = () => {
    const colors = ['orange', 'primary', 'pink', 'purple', 'blue', 'green', 'success']
    return colors[currentStep.value] || 'primary'
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

const getGenderColor = (gender?: string) => {
    switch (gender) {
        case 'MALE': return 'blue'
        case 'FEMALE': return 'pink'
        case 'UNKNOWN': return 'grey'
        default: return 'grey'
    }
}

const getGenderIcon = (gender?: string) => {
    switch (gender) {
        case 'MALE': return 'mdi-human-male'
        case 'FEMALE': return 'mdi-human-female'
        case 'UNKNOWN': return 'mdi-help'
        default: return 'mdi-help'
    }
}

// 安全的性别选择方法
const selectGender = (genderValue: GenderType) => {
    formData.value.gender = genderValue
}

// 新增：随机昵称相关状态
const isGeneratingNickname = ref(false)
const recentNicknames = ref<string[]>([])

// 简化的随机昵称生成方法
const generateRandomNickname = async () => {
    if (isGeneratingNickname.value) return

    isGeneratingNickname.value = true

    try {
        // 添加动画效果
        await new Promise(resolve => setTimeout(resolve, 200))

        // 生成随机昵称
        const nickname = NicknameGenerator.generateNickname()

        // 直接填入输入框
        formData.value.nickname = nickname

        // 添加到历史记录（去重并限制数量）
        if (!recentNicknames.value.includes(nickname)) {
            recentNicknames.value.unshift(nickname)
            // 只保留最近5个
            if (recentNicknames.value.length > 5) {
                recentNicknames.value = recentNicknames.value.slice(0, 5)
            }
        }

        console.log('🎲 生成随机昵称:', nickname)
        showMessage(`已生成昵称：${nickname}`, 'success')

    } catch (error) {
        console.error('❌ 生成昵称失败:', error)
        showMessage('生成昵称失败，请重试', 'error')
    } finally {
        isGeneratingNickname.value = false
    }
}

// 选择历史昵称
const selectRecentNickname = (nickname: string) => {
    formData.value.nickname = nickname
    showMessage(`已选择昵称：${nickname}`, 'success')
}

// 当弹窗打开时重置表单
onMounted(() => {
    if (showDialog.value) {
        resetForm()
    }
})
</script>

<style scoped>
/* 背景渐变 */
.wizard-background {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
}

.wizard-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: transparent !important;
    box-shadow: none !important;
}

.wizard-header {
    position: relative;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 步骤指示器 */
.steps-indicator {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    gap: 12px;
}

.step-indicator {
    position: relative;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.step-indicator.active .step-circle {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    transform: scale(1.1);
}

.step-indicator.completed .step-circle {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.progress-bar {
    margin-bottom: 8px;
    border-radius: 8px !important;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px);
}

.wizard-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
}

/* 卡片样式 */
.step-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.welcome-card,
.success-card {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.step-header {
    padding: 32px 24px 24px;
    border-radius: 24px 24px 0 0;
    text-align: center;
}

/* 水果主题渐变 */
.fruit-gradient {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.fruit-gradient-orange {
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.fruit-gradient-pink {
    background: linear-gradient(135deg, #E91E63 0%, #F06292 100%);
}

.fruit-gradient-purple {
    background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
}

.fruit-gradient-blue {
    background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
}

.fruit-gradient-green {
    background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
}

/* 渐变按钮 */
.fruit-gradient-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
}

.fruit-gradient-pink-btn {
    background: linear-gradient(135deg, #E91E63 0%, #F06292 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4) !important;
}

.fruit-gradient-purple-btn {
    background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4) !important;
}

.fruit-gradient-blue-btn {
    background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4) !important;
}

.fruit-gradient-green-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
}

/* 性别选择卡片 */
.gender-card {
    margin-bottom: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent !important;
}

.gender-card:hover {
    border-color: #9C27B0 !important;
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2) !important;
    transform: translateY(-2px);
}

.gender-card.selected {
    border-color: #9C27B0 !important;
    background: rgba(156, 39, 176, 0.05) !important;
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3) !important;
}

.gender-option {
    display: flex;
    align-items: center;
    gap: 12px;
}

.gender-icon {
    font-size: 24px;
    width: 32px;
    text-align: center;
}

.gender-text {
    font-size: 16px;
    font-weight: 500;
}

/* BMI卡片 */
.bmi-card {
    border: none !important;
}

.bmi-icon {
    font-size: 2rem;
    margin-bottom: 8px;
}

/* 信息摘要卡片 */
.info-summary-card {
    border: 2px solid rgba(76, 175, 80, 0.2) !important;
    background: rgba(76, 175, 80, 0.02) !important;
}

.info-item {
    text-align: center;
    margin-bottom: 16px;
}

.info-label {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
    font-weight: 500;
}

.info-value {
    font-size: 1.1rem;
    font-weight: 600;
}

/* 输入框样式增强 */
.nickname-input :deep(.v-field--focused) {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3) !important;
}

.age-input :deep(.v-field--focused) {
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.3) !important;
}

/* 按钮样式 */
.action-btn {
    flex: 1;
    height: 48px !important;
    font-weight: 600 !important;
    border-width: 2px !important;
}

.start-btn,
.finish-btn {
    padding: 16px 32px !important;
    font-size: 16px !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.start-btn:hover,
.finish-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
}

/* 标题样式 */
.wizard-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 16px;
}

.wizard-subtitle {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 0;
    line-height: 1.5;
}

/* 图标样式 */
.welcome-icon,
.success-icon {
    font-size: 4rem;
    margin-bottom: 24px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* 步骤动作区域 */
.step-actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 32px;
}

.step-actions>* {
    flex: 1;
}

/* 步骤切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(50px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-50px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-50px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(50px);
}

/* BMI 预览 */
.bmi-appear-enter-active {
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.bmi-appear-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
}

/* 基础动画类 */
.animate-fade-in {
    animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-delay {
    animation: fadeIn 0.6s ease-out 0.2s both;
}

.animate-slide-up {
    animation: slideUp 0.6s ease-out 0.3s both;
}

.animate-slide-up-delay {
    animation: slideUp 0.6s ease-out 0.5s both;
}

.animate-scale-in {
    animation: scaleIn 0.5s ease-out 0.4s both;
}

.animate-bounce {
    animation: bounce 1s ease-in-out infinite alternate;
}

.animate-item {
    animation: slideUp 0.4s ease-out both;
}

/* 动画关键帧 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes bounce {
    from {
        transform: scale(1);
    }

    to {
        transform: scale(1.1);
    }
}

/* 交互动画 */
.v-btn {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-text-field,
.v-radio-group {
    transition: all 0.3s ease;
}

.v-text-field:focus-within {
    transform: scale(1.02);
}

/* 进度条动画增强 */
.v-progress-linear {
    transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 移动端动画优化 */
@media (max-width: 600px) {

    .slide-left-enter-from,
    .slide-right-enter-from {
        transform: translateX(30px);
    }

    .slide-left-leave-to,
    .slide-right-leave-to {
        transform: translateX(-30px);
    }
}

/* 减少动画对性能的影响 */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 移动端适配 */
@media (max-width: 600px) {
    .wizard-header {
        padding: 16px;
    }

    .steps-indicator {
        gap: 8px;
    }

    .step-circle {
        width: 28px;
        height: 28px;
        font-size: 11px;
    }

    .step-header {
        padding: 24px 16px 16px;
    }

    .wizard-title {
        font-size: 1.5rem;
    }

    .step-actions {
        flex-direction: column;
        gap: 12px;
    }
}

/* 昵称相关样式 */
.nickname-dice-btn {
    transition: all 0.3s ease;
}

.nickname-dice-btn:hover {
    transform: scale(1.15) rotate(20deg);
    background-color: rgba(76, 175, 80, 0.1) !important;
}

.dice-icon {
    transition: all 0.3s ease;
    animation: diceFloat 2s ease-in-out infinite;
}

.nickname-dice-btn:hover .dice-icon {
    animation: diceRoll 0.8s ease-in-out;
}

.nickname-dice-btn:active {
    transform: scale(0.95) rotate(10deg);
}

/* 增强骰子动画 */
@keyframes diceFloat {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-3px) rotate(5deg);
    }
}

@keyframes diceRoll {
    0% {
        transform: rotate(0deg) scale(1);
    }

    25% {
        transform: rotate(90deg) scale(1.1);
    }

    50% {
        transform: rotate(180deg) scale(1.2);
    }

    75% {
        transform: rotate(270deg) scale(1.1);
    }

    100% {
        transform: rotate(360deg) scale(1);
    }
}

/* 昵称提示 */
.nickname-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    padding: 8px 12px;
    background: rgba(76, 175, 80, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(76, 175, 80, 0.1);
}

/* 最近昵称样式 */
.recent-nicknames {
    margin-top: 16px;
    padding: 12px;
    background: rgba(76, 175, 80, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(76, 175, 80, 0.1);
}

.recent-nicknames-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.recent-nicknames-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.recent-nickname-chip {
    cursor: pointer;
    transition: all 0.2s ease;
}

.recent-nickname-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    background-color: rgba(76, 175, 80, 0.1) !important;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .recent-nicknames-list {
        gap: 4px;
    }

    .recent-nickname-chip {
        font-size: 12px !important;
    }
}

/* 深色主题支持 */
.v-theme--dark .nickname-tips {
    background: rgba(76, 175, 80, 0.1);
    border-color: rgba(76, 175, 80, 0.2);
}

.v-theme--dark .recent-nicknames {
    background: rgba(76, 175, 80, 0.08);
    border-color: rgba(76, 175, 80, 0.2);
}
</style>
