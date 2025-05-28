<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, sendVerificationCode as apiSendVerificationCode } from '@/api/auth'
import AppNavigation from '@/components/AppNavigation.vue'

const router = useRouter()

const formData = ref({
    email: '',
    password: '',
    confirmPassword: '',
    code: '' // 添加验证码字段
})

const formValid = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const agreeToTerms = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)
const sendingCode = ref(false)
const codeCountdown = ref(0)

const emailRules = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
    (v: string) => !!v || '密码不能为空',
    (v: string) => v.length >= 6 || '密码至少需要6位字符'
]

const confirmPasswordRules = [
    (v: string) => !!v || '请确认密码',
    (v: string) => v === formData.value.password || '两次输入的密码不一致'
]

const codeRules = [
    (v: string) => !!v || '验证码不能为空',
    (v: string) => /^\d{4}$/.test(v) || '请输入4位数字验证码'
]

// 显示提示信息
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 发送验证码
const sendVerificationCode = async () => {
    console.log('🎯 点击发送验证码按钮')

    if (!formData.value.email) {
        showMessage('请先输入邮箱地址', 'error')
        return
    }

    if (!/.+@.+\..+/.test(formData.value.email)) {
        showMessage('请输入有效的邮箱地址', 'error')
        return
    }

    sendingCode.value = true
    console.log('📤 开始发送验证码到:', formData.value.email)

    try {
        // 使用重命名的API函数
        const result = await apiSendVerificationCode(formData.value.email)
        console.log('📨 验证码发送响应:', result)

        if (result.code === 200) {
            showMessage('验证码已发送到您的邮箱，请注意查收', 'success')

            // 开始倒计时
            codeCountdown.value = 60
            const timer = setInterval(() => {
                codeCountdown.value--
                if (codeCountdown.value <= 0) {
                    clearInterval(timer)
                    console.log('⏰ 倒计时结束，可以重新发送验证码')
                }
            }, 1000)

        } else {
            console.warn('⚠️ 验证码发送失败:', result.msg)
            showMessage(result.msg || '验证码发送失败，请稍后重试', 'error')
        }

    } catch (error: any) {
        console.error('💥 发送验证码异常:', error)
        let message = '验证码发送失败，请检查网络连接'

        if (error.name === 'BusinessError') {
            message = error.message
        } else if (error.message) {
            message = error.message
        }

        showMessage(message, 'error')

    } finally {
        sendingCode.value = false
        console.log('🏁 验证码发送流程结束')
    }
}

const handleRegister = async () => {
    if (!formValid.value || !agreeToTerms.value) {
        showMessage('请完善表单信息并同意服务条款', 'error')
        return
    }

    if (loading.value) return

    loading.value = true
    try {
        const response = await register({
            email: formData.value.email,
            password: formData.value.password,
            code: formData.value.code
        })

        // 修复：使用response.data获取实际的API响应数据
        if (response.data.code === 200) {
            showMessage('注册成功！请登录您的账户', 'success')
            setTimeout(() => {
                router.push('/login')
            }, 1500)
        } else {
            showMessage(response.data.msg || '注册失败', 'error')
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

const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <div class="register-page">
        <!-- 使用统一的导航组件 -->
        <AppNavigation :show-search-button="false" :show-cart-button="false" />

        <!-- 注册内容 -->
        <div class="register-content">
            <v-card class="register-card" elevation="24" rounded="xl">
                <!-- 标题区域 -->
                <div class="register-header">
                    <div class="fruit-icon">🥝</div>
                    <h1 class="register-title">加入我们</h1>
                    <p class="register-subtitle">创建您的水果生活账户</p>
                </div>

                <!-- 注册表单 -->
                <div class="register-form">
                    <v-form v-model="formValid" @submit.prevent="handleRegister">
                        <!-- 邮箱输入 -->
                        <v-text-field v-model="formData.email" label="邮箱地址" prepend-inner-icon="mdi-email"
                            :rules="emailRules" variant="outlined" class="form-field" rounded="lg" clearable
                            density="comfortable" autocomplete="email" name="email" type="email">
                        </v-text-field>

                        <!-- 验证码输入 -->
                        <div class="code-input-container">
                            <v-text-field v-model="formData.code" label="邮箱验证码" prepend-inner-icon="mdi-shield-check"
                                :rules="codeRules" variant="outlined" class="code-field" rounded="lg"
                                density="comfortable" placeholder="请输入4位验证码" maxlength="4">
                            </v-text-field>
                            <v-btn :disabled="sendingCode || codeCountdown > 0 || !formData.email"
                                :loading="sendingCode" color="primary" variant="outlined" class="send-code-btn"
                                rounded="lg" @click="sendVerificationCode">
                                {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '发送验证码' }}
                            </v-btn>
                        </div>

                        <!-- 密码输入 -->
                        <v-text-field v-model="formData.password" label="密码" prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                            class="form-field" rounded="lg" density="comfortable" autocomplete="new-password"
                            name="password" @click:append-inner="showPassword = !showPassword">
                        </v-text-field>

                        <!-- 确认密码输入 -->
                        <v-text-field v-model="formData.confirmPassword" label="确认密码"
                            prepend-inner-icon="mdi-lock-check"
                            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPasswordRules"
                            variant="outlined" class="form-field" rounded="lg" density="comfortable"
                            autocomplete="new-password" name="confirmPassword"
                            @click:append-inner="showConfirmPassword = !showConfirmPassword">
                        </v-text-field>

                        <!-- 服务条款同意 -->
                        <div class="terms-section">
                            <v-checkbox v-model="agreeToTerms" color="primary" density="compact" hide-details>
                                <template v-slot:label>
                                    <span class="terms-text">
                                        我已阅读并同意
                                        <v-btn color="primary" variant="text" size="small" class="terms-link"
                                            @click="showTerms = true">
                                            《服务条款》
                                        </v-btn>
                                        和
                                        <v-btn color="primary" variant="text" size="small" class="terms-link"
                                            @click="showPrivacy = true">
                                            《隐私政策》
                                        </v-btn>
                                    </span>
                                </template>
                            </v-checkbox>
                        </div>

                        <!-- 注册按钮 -->
                        <v-btn :disabled="!formValid || !agreeToTerms || loading" :loading="loading" color="primary"
                            variant="elevated" size="x-large" rounded="xl" block class="register-btn" type="submit">
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

        <!-- 服务条款对话框 -->
        <v-dialog v-model="showTerms" max-width="600px">
            <v-card rounded="xl">
                <v-card-title class="text-h5 font-weight-bold">服务条款</v-card-title>
                <v-card-text>
                    <p>欢迎使用水果生活服务...</p>
                    <!-- 这里可以放置详细的服务条款内容 -->
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showTerms = false">我知道了</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 隐私政策对话框 -->
        <v-dialog v-model="showPrivacy" max-width="600px">
            <v-card rounded="xl">
                <v-card-title class="text-h5 font-weight-bold">隐私政策</v-card-title>
                <v-card-text>
                    <p>我们重视您的隐私保护...</p>
                    <!-- 这里可以放置详细的隐私政策内容 -->
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showPrivacy = false">我知道了</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    position: relative;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    display: flex;
    flex-direction: column;
}

.register-content {
    margin-top: 64px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.register-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
    padding: 48px 40px;
    width: 100%;
    max-width: 500px;
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

.code-input-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.code-field {
    flex: 1;
}

.send-code-btn {
    min-width: 120px;
    height: 56px;
    font-weight: 600;
}

.terms-section {
    margin-bottom: 24px;
}

.terms-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    line-height: 1.4;
}

.terms-link {
    font-size: 14px !important;
    font-weight: 500 !important;
    min-height: auto !important;
    padding: 0 4px !important;
    text-decoration: underline;
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

/* 移动端适配 */
@media (max-width: 600px) {
    .register-content {
        margin-top: 56px;
        padding: 16px;
    }

    .register-card {
        padding: 32px 24px;
    }

    .register-title {
        font-size: 1.75rem;
    }

    .fruit-icon {
        font-size: 3rem;
    }
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

/* 复选框样式 */
:deep(.v-selection-control) {
    align-items: flex-start !important;
}

:deep(.v-selection-control__wrapper) {
    margin-top: 2px;
}
</style>
