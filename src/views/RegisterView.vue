<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { sendVerificationCode, register } from '@/api/auth'

const router = useRouter()

// 表单数据
const formData = ref({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
})

// 表单验证
const formValid = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 验证规则
const emailRules = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
    (v: string) => !!v || '密码不能为空',
    (v: string) => v.length >= 6 || '密码至少6位字符',
    (v: string) => /^(?=.*[a-zA-Z])(?=.*\d)/.test(v) || '密码必须包含字母和数字'
]

const confirmPasswordRules = [
    (v: string) => !!v || '请确认密码',
    (v: string) => v === formData.value.password || '两次密码输入不一致'
]

const codeRules = [
    (v: string) => !!v || '验证码不能为空',
    (v: string) => /^\d{6}$/.test(v) || '验证码必须是6位数字'
]

// 计算属性
const canSendCode = computed(() => {
    return formData.value.email &&
        /.+@.+\..+/.test(formData.value.email) &&
        countdown.value === 0
})

const countdownText = computed(() => {
    return countdown.value > 0 ? `${countdown.value}s` : '获取验证码'
})

// 显示提示信息
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 倒计时函数
const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

// 发送验证码
const handleSendCode = async () => {
    if (!canSendCode.value) return

    codeLoading.value = true
    try {
        const response = await sendVerificationCode(formData.value.email)

        // 检查返回结果
        if (response.code === 200) {
            showMessage('验证码已发送到您的邮箱，请查收', 'success')
            startCountdown()
        } else {
            showMessage(response.msg || '发送验证码失败', 'error')
        }
    } catch (error: any) {
        console.error('发送验证码失败:', error)

        // 处理不同类型的错误
        let message = '发送验证码失败，请稍后重试'

        if (error.name === 'BusinessError') {
            // 业务错误，使用后端返回的消息
            message = error.message
        } else if (error.message) {
            // 网络错误或其他错误
            message = error.message
        }

        showMessage(message, 'error')
    } finally {
        codeLoading.value = false
    }
}

// 提交注册
const handleRegister = async () => {
    if (!formValid.value) return

    loading.value = true
    try {
        // 调用注册接口
        const response = await register({
            email: formData.value.email,
            password: formData.value.password,
            verificationCode: formData.value.verificationCode
        })

        if (response.code === 200) {
            showMessage('注册成功！正在跳转...', 'success')
            setTimeout(() => {
                router.push('/login')
            }, 1500)
        } else {
            showMessage(response.msg || '注册失败', 'error')
        }
    } catch (error: any) {
        console.error('注册失败:', error)

        let message = '注册失败，请稍后重试'

        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message) {
            message = error.message
        }

        showMessage(message, 'error')
    } finally {
        loading.value = false
    }
}

// 跳转到登录
const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <div class="register-wrapper">
        <div class="register-content">
            <v-card class="register-card" elevation="24" rounded="xl">
                <!-- 标题区域 -->
                <div class="register-header">
                    <div class="fruit-icon">🍎</div>
                    <h1 class="register-title">欢迎注册水果生活</h1>
                    <p class="register-subtitle">开启您的健康水果之旅</p>
                </div>

                <!-- 注册表单 -->
                <div class="register-form">
                    <v-form v-model="formValid" @submit.prevent="handleRegister">
                        <!-- 邮箱输入 -->
                        <v-text-field v-model="formData.email" label="邮箱地址" prepend-inner-icon="mdi-email"
                            :rules="emailRules" variant="outlined" class="form-field" rounded="lg" clearable
                            density="comfortable"></v-text-field>

                        <!-- 密码输入 -->
                        <v-text-field v-model="formData.password" label="密码" prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                            class="form-field" rounded="lg" density="comfortable"
                            @click:append-inner="showPassword = !showPassword"></v-text-field>

                        <!-- 确认密码 -->
                        <v-text-field v-model="formData.confirmPassword" label="确认密码"
                            prepend-inner-icon="mdi-lock-check"
                            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPasswordRules"
                            variant="outlined" class="form-field" rounded="lg" density="comfortable"
                            @click:append-inner="showConfirmPassword = !showConfirmPassword"></v-text-field>

                        <!-- 验证码输入 -->
                        <div class="verification-row">
                            <v-text-field v-model="formData.verificationCode" label="验证码"
                                prepend-inner-icon="mdi-shield-check" :rules="codeRules" variant="outlined"
                                class="verification-input" rounded="lg" maxlength="6"
                                density="comfortable"></v-text-field>
                            <v-btn :disabled="!canSendCode" :loading="codeLoading" color="primary" variant="outlined"
                                class="verification-btn" rounded="lg" @click="handleSendCode">
                                {{ countdownText }}
                            </v-btn>
                        </div>

                        <!-- 注册按钮 -->
                        <v-btn :disabled="!formValid" :loading="loading" color="primary" variant="elevated"
                            size="x-large" rounded="xl" block class="register-btn" type="submit">
                            <v-icon start>mdi-account-plus</v-icon>
                            立即注册
                        </v-btn>

                        <!-- 登录链接 -->
                        <div class="login-link">
                            <span>已有账号？</span>
                            <v-btn color="primary" variant="text" class="login-btn-text" @click="goToLogin">
                                立即登录
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </v-card>
        </div>

        <!-- 提示信息 -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top" rounded="lg">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<style scoped>
.register-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.register-content {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

.register-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
    padding: 48px 40px;
}

.register-header {
    text-align: center;
    margin-bottom: 40px;
}

.fruit-icon {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 24px;
}

.register-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    margin: 0 0 16px 0;
}

.register-subtitle {
    font-size: 1.1rem;
    color: rgba(0, 0, 0, 0.7);
    margin: 0;
}

.register-form {
    width: 100%;
}

.form-field {
    margin-bottom: 24px;
}

.verification-row {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    align-items: flex-start;
}

.verification-input {
    flex: 1;
}

.verification-btn {
    height: 56px;
    min-width: 120px;
    font-size: 14px;
    margin-top: 0;
}

.register-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 18px !important;
    height: 56px !important;
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3) !important;
    transition: all 0.3s ease !important;
}

.register-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(76, 175, 80, 0.4) !important;
}

.login-link {
    text-align: center;
    font-size: 16px;
}

.login-link span {
    color: rgba(0, 0, 0, 0.7);
}

.login-btn-text {
    font-size: 16px !important;
    font-weight: 600 !important;
}

/* 输入框样式 */
:deep(.v-field) {
    font-size: 16px !important;
    min-height: 56px !important;
}

:deep(.v-field__input) {
    font-size: 16px !important;
    padding: 16px !important;
}

:deep(.v-field--focused) {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3) !important;
}

:deep(.v-label) {
    font-size: 14px !important;
    font-weight: 500 !important;
}

/* 图标样式 */
:deep(.v-field__prepend-inner) {
    padding-top: 16px !important;
}

:deep(.v-field__append-inner) {
    padding-top: 16px !important;
}

/* 按钮禁用状态 */
.v-btn:disabled {
    opacity: 0.6 !important;
}
</style>
