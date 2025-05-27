<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { verifyEmail, sendVerificationCode, verifyCode, handlePassword } from '@/api/auth'

const router = useRouter()

// 步骤控制
const currentStep = ref(1) // 1: 邮箱验证, 2: 验证码验证, 3: 重置密码

const formData = ref({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
})

const formValid = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 邮箱验证状态
const emailVerified = ref(false)
const emailVerifying = ref(false)

// 验证规则
const emailRules = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const codeRules = [
    (v: string) => !!v || '验证码不能为空',
    (v: string) => /^\d{4}$/.test(v) || '验证码必须是4位数字'
]

const passwordRules = [
    (v: string) => !!v || '密码不能为空',
    (v: string) => v.length >= 6 || '密码至少6位字符',
    (v: string) => /^(?=.*[a-zA-Z])(?=.*\d)/.test(v) || '密码必须包含字母和数字'
]

const confirmPasswordRules = [
    (v: string) => !!v || '确认密码不能为空',
    (v: string) => v === formData.value.newPassword || '两次密码输入不一致'
]

// 倒计时文本
const countdownText = computed(() => {
    return countdown.value > 0 ? `${countdown.value}s后重发` : '发送验证码'
})

// 是否可以发送验证码
const canSendCode = computed(() => {
    return countdown.value === 0 && /.+@.+\..+/.test(formData.value.email)
})

// 显示提示信息
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 发送验证码 - 使用统一的验证码接口
const handleSendCode = async () => {
    if (!canSendCode.value) return

    codeLoading.value = true
    try {
        // 使用统一的验证码发送接口
        await sendVerificationCode(formData.value.email)

        showMessage('验证码已发送到您的邮箱', 'success')
        startCountdown()
    } catch (error: any) {
        console.error('验证码发送失败:', error)

        let message = '验证码发送失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message.includes('ECONNREFUSED')) {
            message = '无法连接到服务器，请检查网络连接'
        }

        showMessage(message, 'error')
    } finally {
        codeLoading.value = false
    }
}

// 验证邮箱是否存在
const handleVerifyEmail = async () => {
    if (!/.+@.+\..+/.test(formData.value.email)) {
        showMessage('请输入有效的邮箱地址', 'error')
        return
    }

    emailVerifying.value = true
    try {
        const response = await verifyEmail(formData.value.email)

        if (response.data === true) {
            emailVerified.value = true
            showMessage('邮箱验证成功', 'success')
            return true
        } else {
            emailVerified.value = false
            showMessage('该邮箱未注册，请检查邮箱地址或先注册账号', 'error')
            return false
        }
    } catch (error: any) {
        console.error('邮箱验证失败:', error)
        emailVerified.value = false

        let message = '邮箱验证失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        }

        showMessage(message, 'error')
        return false
    } finally {
        emailVerifying.value = false
    }
}

// 验证验证码
const handleVerifyCode = async () => {
    if (!formData.value.verificationCode || formData.value.verificationCode.length !== 4) {
        showMessage('请输入4位验证码', 'error')
        return false
    }

    try {
        const response = await verifyCode({
            email: formData.value.email,
            code: formData.value.verificationCode
        })

        if (response.data === true) {
            showMessage('验证码验证成功', 'success')
            return true
        } else {
            showMessage('验证码错误，请重新输入', 'error')
            return false
        }
    } catch (error: any) {
        console.error('验证码验证失败:', error)

        let message = '验证码验证失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        }

        showMessage(message, 'error')
        return false
    }
}

// 重置密码
const handleResetPassword = async () => {
    if (formData.value.newPassword !== formData.value.confirmPassword) {
        showMessage('两次密码输入不一致', 'error')
        return false
    }

    if (formData.value.newPassword.length < 6) {
        showMessage('密码至少需要6位字符', 'error')
        return false
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(formData.value.newPassword)) {
        showMessage('密码必须包含字母和数字', 'error')
        return false
    }

    try {
        const response = await handlePassword({
            email: formData.value.email,
            password: formData.value.newPassword,
            code: formData.value.verificationCode
        })

        if (response.code === 200) {
            showMessage('密码重置成功！正在跳转到登录页...', 'success')
            return true
        } else {
            showMessage(response.msg || '密码重置失败', 'error')
            return false
        }
    } catch (error: any) {
        console.error('密码重置失败:', error)

        let message = '密码重置失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message.includes('ECONNREFUSED')) {
            message = '无法连接到服务器，请检查网络连接'
        }

        showMessage(message, 'error')
        return false
    }
}

// 开始倒计时
const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

// 下一步
const handleNext = async () => {
    if (!formValid.value) return

    // 防止重复提交
    if (loading.value) {
        console.log('正在处理中，忽略重复提交')
        return
    }

    loading.value = true
    try {
        if (currentStep.value === 1) {
            // 验证邮箱步骤
            const isEmailValid = await handleVerifyEmail()
            if (isEmailValid) {
                currentStep.value = 2
                showMessage('邮箱验证成功，请输入验证码', 'success')
                // 自动发送验证码
                setTimeout(() => {
                    handleSendCode()
                }, 500)
            }
        } else if (currentStep.value === 2) {
            // 验证码验证步骤
            const isCodeValid = await handleVerifyCode()
            if (isCodeValid) {
                currentStep.value = 3
                showMessage('验证码验证成功，请设置新密码', 'success')
            }
        } else if (currentStep.value === 3) {
            // 重置密码步骤
            const isResetSuccess = await handleResetPassword()
            if (isResetSuccess) {
                setTimeout(() => {
                    router.push('/login')
                }, 1500)
            }
        }
    } catch (error) {
        // 各个步骤的方法已经处理了错误显示
    } finally {
        loading.value = false
    }
}

// 返回登录
const goToLogin = () => {
    router.push('/login')
}

// 上一步
const goBack = () => {
    if (currentStep.value > 1) {
        currentStep.value--
        // 清除当前步骤的数据
        if (currentStep.value === 1) {
            emailVerified.value = false
            formData.value.verificationCode = ''
        } else if (currentStep.value === 2) {
            formData.value.newPassword = ''
            formData.value.confirmPassword = ''
        }
    }
}
</script>

<template>
    <div class="forgot-password-wrapper">
        <div class="forgot-password-content">
            <v-card class="forgot-password-card" elevation="24" rounded="xl">
                <!-- 步骤指示器 -->
                <div class="steps-indicator">
                    <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                        <div class="step-circle">
                            <v-icon v-if="currentStep > 1" color="white">mdi-check</v-icon>
                            <span v-else>1</span>
                        </div>
                        <span class="step-label">验证邮箱</span>
                    </div>

                    <div class="step-line" :class="{ active: currentStep > 1 }"></div>

                    <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                        <div class="step-circle">
                            <v-icon v-if="currentStep > 2" color="white">mdi-check</v-icon>
                            <span v-else>2</span>
                        </div>
                        <span class="step-label">输入验证码</span>
                    </div>

                    <div class="step-line" :class="{ active: currentStep > 2 }"></div>

                    <div class="step-item" :class="{ active: currentStep >= 3 }">
                        <div class="step-circle">3</div>
                        <span class="step-label">重置密码</span>
                    </div>
                </div>

                <!-- 标题区域 -->
                <div class="forgot-password-header">
                    <div class="fruit-icon">🔐</div>
                    <h1 class="forgot-password-title">
                        <span v-if="currentStep === 1">验证您的邮箱</span>
                        <span v-else-if="currentStep === 2">输入验证码</span>
                        <span v-else>设置新密码</span>
                    </h1>
                    <p class="forgot-password-subtitle">
                        <span v-if="currentStep === 1">请输入您注册时使用的邮箱地址</span>
                        <span v-else-if="currentStep === 2">我们已向您的邮箱发送了4位数字验证码</span>
                        <span v-else>请设置您的新密码，密码需包含字母和数字且至少6位</span>
                    </p>
                </div>

                <!-- 表单区域 -->
                <div class="forgot-password-form">
                    <v-form v-model="formValid" @submit.prevent="handleNext">

                        <!-- 步骤1: 邮箱验证 -->
                        <div v-if="currentStep === 1" class="step-content">
                            <v-text-field v-model="formData.email" label="邮箱地址" prepend-inner-icon="mdi-email"
                                :rules="emailRules" variant="outlined" class="form-field" rounded="lg" clearable
                                density="comfortable" autocomplete="email" name="email" type="email"
                                :loading="emailVerifying" @blur="emailVerified = false">
                                <template v-slot:append-inner>
                                    <v-icon v-if="emailVerified" color="success" class="verification-icon">
                                        mdi-check-circle
                                    </v-icon>
                                </template>
                            </v-text-field>

                            <!-- 邮箱状态提示 -->
                            <div v-if="emailVerified" class="email-status success">
                                <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                                <span>邮箱验证成功，该邮箱已注册</span>
                            </div>
                        </div>

                        <!-- 步骤2: 验证码验证 -->
                        <div v-if="currentStep === 2" class="step-content">
                            <div class="email-display">
                                <v-icon color="primary" class="mr-2">mdi-email-check</v-icon>
                                <span>验证码已发送至: {{ formData.email }}</span>
                            </div>

                            <div class="verification-row">
                                <v-text-field v-model="formData.verificationCode" label="4位验证码"
                                    prepend-inner-icon="mdi-shield-check" :rules="codeRules" variant="outlined"
                                    class="verification-input" rounded="lg" maxlength="4" density="comfortable"
                                    placeholder="请输入4位数字"></v-text-field>
                                <v-btn :disabled="!canSendCode" :loading="codeLoading" color="primary"
                                    variant="outlined" class="verification-btn" rounded="lg" @click="handleSendCode">
                                    {{ countdownText }}
                                </v-btn>
                            </div>

                            <!-- 验证码提示 -->
                            <div class="code-tips">
                                <v-icon color="info" size="small" class="mr-1">mdi-information</v-icon>
                                <span class="text-caption">验证码有效期为5分钟，请及时输入</span>
                            </div>
                        </div>

                        <!-- 步骤3: 重置密码 -->
                        <div v-if="currentStep === 3" class="step-content">
                            <div class="password-info">
                                <v-icon color="primary" class="mr-2">mdi-lock-reset</v-icon>
                                <span>为账号 {{ formData.email }} 设置新密码</span>
                            </div>

                            <v-text-field v-model="formData.newPassword" label="新密码" prepend-inner-icon="mdi-lock"
                                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showNewPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                                class="form-field" rounded="lg" density="comfortable" autocomplete="new-password"
                                placeholder="请输入新密码"
                                @click:append-inner="showNewPassword = !showNewPassword"></v-text-field>

                            <v-text-field v-model="formData.confirmPassword" label="确认新密码"
                                prepend-inner-icon="mdi-lock-check"
                                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPasswordRules"
                                variant="outlined" class="form-field" rounded="lg" density="comfortable"
                                autocomplete="new-password" placeholder="请再次输入新密码"
                                @click:append-inner="showConfirmPassword = !showConfirmPassword"></v-text-field>

                            <!-- 密码强度提示 -->
                            <div class="password-tips">
                                <v-icon color="info" size="small" class="mr-1">mdi-information</v-icon>
                                <span class="text-caption">密码需包含字母和数字，至少6位字符</span>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="action-buttons">
                            <v-btn v-if="currentStep > 1" variant="outlined" color="primary" size="large" rounded="xl"
                                class="back-btn" @click="goBack">
                                <v-icon start>mdi-arrow-left</v-icon>
                                上一步
                            </v-btn>

                            <v-btn :disabled="!formValid || loading || (currentStep === 1 && emailVerifying)"
                                :loading="loading || emailVerifying" color="primary" variant="elevated" size="x-large"
                                rounded="xl" class="next-btn" type="submit"
                                :class="{ 'full-width': currentStep === 1 }">
                                <v-icon start>
                                    {{ currentStep === 3 ? 'mdi-check' : 'mdi-arrow-right' }}
                                </v-icon>
                                {{
                                    currentStep === 1 ? '验证邮箱' :
                                        currentStep === 2 ? '验证验证码' :
                                            '重置密码'
                                }}
                            </v-btn>
                        </div>

                        <!-- 返回登录链接 -->
                        <div class="login-link">
                            <span>想起密码了？</span>
                            <v-btn color="primary" variant="text" class="login-btn-text" @click="goToLogin">
                                返回登录
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
.forgot-password-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.forgot-password-content {
    width: 100%;
    max-width: 550px;
    margin: 0 auto;
}

.forgot-password-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
    padding: 40px;
}

/* 步骤指示器 */
.steps-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    padding: 0 20px;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #666;
    transition: all 0.3s ease;
}

.step-item.active .step-circle {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
}

.step-item.completed .step-circle {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
}

.step-label {
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.step-item.active .step-label {
    color: #4CAF50;
    font-weight: 600;
}

.step-line {
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    margin: 0 20px;
    transition: all 0.3s ease;
}

.step-line.active {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

/* 标题区域 */
.forgot-password-header {
    text-align: center;
    margin-bottom: 40px;
}

.fruit-icon {
    font-size: 3.5rem;
    line-height: 1;
    margin-bottom: 20px;
}

.forgot-password-title {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    margin: 0 0 12px 0;
}

.forgot-password-subtitle {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.7);
    margin: 0;
    line-height: 1.5;
}

/* 表单样式 */
.forgot-password-form {
    width: 100%;
}

.step-content {
    min-height: 120px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-field {
    margin-bottom: 24px;
}

.email-display {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 12px;
    color: #4CAF50;
    font-weight: 500;
    margin-bottom: 8px;
}

.verification-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.verification-input {
    flex: 1;
}

.verification-btn {
    height: 56px;
    min-width: 120px;
    font-size: 14px;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
}

.back-btn {
    flex: 1;
    height: 56px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
}

.next-btn {
    flex: 2;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    height: 56px !important;
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3) !important;
    transition: all 0.3s ease !important;
}

.next-btn.full-width {
    flex: 1;
}

.next-btn:hover {
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

/* 响应式调整 */
@media (max-width: 600px) {
    .steps-indicator {
        padding: 0 10px;
    }

    .step-line {
        margin: 0 10px;
    }

    .step-label {
        font-size: 10px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .back-btn,
    .next-btn {
        flex: 1 !important;
    }
}

.email-status {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    margin-top: -16px;
    margin-bottom: 8px;
}

.email-status.success {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.verification-icon {
    animation: checkmark 0.3s ease-in-out;
}

@keyframes checkmark {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.code-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    margin-top: 8px;
}

.password-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 12px;
    color: #4CAF50;
    font-weight: 500;
    margin-bottom: 24px;
}

.password-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    margin-top: -8px;
    margin-bottom: 8px;
}
</style>
