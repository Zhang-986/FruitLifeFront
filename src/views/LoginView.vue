<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { checkUserInfoCompleted } from '@/api/profile'
import { AuthManager } from '@/utils/auth-manager'
import AppNavigation from '@/components/AppNavigation.vue'

const router = useRouter()

const formData = ref({
    email: '',
    password: ''
})

const formValid = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const emailRules = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
    (v: string) => !!v || '密码不能为空'
]

// 显示提示信息
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

const handleLogin = async () => {
    console.log('登录按钮被点击')

    if (!formValid.value) {
        console.log('表单验证失败')
        return
    }

    if (loading.value) {
        console.log('正在处理中，忽略重复提交')
        return
    }

    loading.value = true
    try {
        console.log('开始登录请求')
        const response = await login({
            email: formData.value.email,
            password: formData.value.password
        })

        console.log('登录响应:', response)

        if (response.code === 200) {
            // 使用AuthManager保存JWT token
            AuthManager.saveToken(response.data, formData.value.email)

            showMessage('登录成功！正在检查用户信息...', 'success')

            // 触发浏览器的密码保存提示
            triggerPasswordSave()

            // 登录成功后立即检查用户信息完善状态
            try {
                console.log('🔍 开始检查用户信息完善状态...')
                const userInfoResponse = await checkUserInfoCompleted()

                console.log('🔍 详细响应分析:')
                console.log('- 响应码:', userInfoResponse.code)
                console.log('- 响应消息:', userInfoResponse.msg)
                console.log('- 响应数据:', userInfoResponse.data)

                // 修复：根据data字段的值判断
                // userInfoResponse.data === "true" 表示已完善
                // userInfoResponse.data === "false" 表示未完善
                const isUserInfoCompleted = userInfoResponse.code === 200 && userInfoResponse.data === "true"

                if (isUserInfoCompleted) {
                    console.log('🎉 用户信息已完善，跳转到用户中心')
                    // 用户信息已完善，跳转到用户中心
                    setTimeout(() => {
                        router.replace('/user')
                    }, 1500)
                } else {
                    console.log('📝 用户信息未完善，跳转到资料完善页面')
                    console.log('📝 状态详情: data =', userInfoResponse.data)
                    // 用户信息未完善，跳转到资料完善页面
                    showMessage('请先完善个人资料以获得更好的体验', 'info')
                    setTimeout(() => {
                        router.replace('/user/profile-wizard')
                    }, 1500)
                }

            } catch (error) {
                console.error('❌ 用户信息完善状态检查失败:', error)
                console.log('📝 检查失败，默认跳转到资料完善页面（安全策略）')
                // 检查失败时，默认跳转到资料完善页面（安全起见）
                showMessage('请完善个人资料以获得更好的体验', 'info')
                setTimeout(() => {
                    router.replace('/user/profile-wizard')
                }, 1500)
            }

            

        } else {
            showMessage(response.msg || '登录失败', 'error')
        }
    } catch (error: any) {
        console.error('登录失败:', error)

        let message = '登录失败，请稍后重试'

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

// 触发浏览器密码保存提示
const triggerPasswordSave = () => {
    try {
        // 创建一个隐藏的原生表单来触发浏览器的密码保存
        const form = document.createElement('form')
        form.style.display = 'none'
        form.method = 'post'
        form.action = window.location.href

        // 创建用户名输入框
        const usernameInput = document.createElement('input')
        usernameInput.type = 'email'
        usernameInput.name = 'username'
        usernameInput.value = formData.value.email
        usernameInput.autocomplete = 'username'

        // 创建密码输入框
        const passwordInput = document.createElement('input')
        passwordInput.type = 'password'
        passwordInput.name = 'password'
        passwordInput.value = formData.value.password
        passwordInput.autocomplete = 'current-password'

        // 添加到表单
        form.appendChild(usernameInput)
        form.appendChild(passwordInput)

        // 添加到页面
        document.body.appendChild(form)

        // 模拟表单提交来触发密码保存
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)

        // 清理
        setTimeout(() => {
            document.body.removeChild(form)
        }, 100)

        console.log('✅ 已触发浏览器密码保存提示')
    } catch (error) {
        console.warn('⚠️ 触发密码保存失败:', error)
    }
}

const goToRegister = () => {
    router.push('/register')
}

const goToForgotPassword = () => {
    router.push('/forgot-password')
}

// 页面加载时的处理
onMounted(() => {
    console.log('🔍 LoginView加载，检查登录状态')
    if (AuthManager.isLoggedIn()) {
        console.log('✅ 已登录，重定向到用户中心')
        router.replace('/user')
        return
    }

    // 清除可能存在的localStorage密码数据，避免干扰浏览器自动填充
    localStorage.removeItem('rememberPassword')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')
    console.log('🧹 清除localStorage密码数据，使用浏览器原生密码管理')
})
</script>

<template>
    <div class="login-page">
        <!-- 使用统一的导航组件 -->
        <AppNavigation :show-search-button="false" :show-cart-button="false" />

        <!-- 登录内容 -->
        <div class="login-content">
            <v-card class="login-card" elevation="24" rounded="xl">
                <!-- 标题区域 -->
                <div class="login-header">
                    <div class="fruit-icon">🍊</div>
                    <h1 class="login-title">欢迎回来</h1>
                    <p class="login-subtitle">登录您的水果生活账户</p>
                </div>

                <!-- 登录表单 -->
                <div class="login-form">
                    <v-form v-model="formValid" @submit.prevent="handleLogin">
                        <!-- 邮箱输入 -->
                        <v-text-field v-model="formData.email" label="邮箱地址" prepend-inner-icon="mdi-email"
                            :rules="emailRules" variant="outlined" class="form-field" rounded="lg" clearable
                            density="comfortable" autocomplete="username email" name="email" type="email" id="email">
                        </v-text-field>

                        <!-- 密码输入 -->
                        <v-text-field v-model="formData.password" label="密码" prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                            class="form-field" rounded="lg" density="comfortable" autocomplete="current-password"
                            name="password" id="password" @click:append-inner="showPassword = !showPassword">
                        </v-text-field>

                        <!-- 移除记住密码选项 -->
                        <div class="password-tips">
                            <v-icon color="info" size="small" class="mr-1">mdi-information</v-icon>
                            <span class="text-caption">浏览器会为您安全保存登录信息</span>
                        </div>

                        <!-- 忘记密码链接 -->
                        <div class="forgot-password-section">
                            <v-btn color="primary" variant="text" size="small" class="forgot-password-link"
                                @click="goToForgotPassword">
                                忘记密码？
                            </v-btn>
                        </div>

                        <!-- 登录按钮 -->
                        <v-btn :disabled="!formValid || loading" :loading="loading" color="primary" variant="elevated"
                            size="x-large" rounded="xl" block class="login-btn" type="submit">
                            <v-icon start>mdi-login</v-icon>
                            立即登录
                        </v-btn>

                        <!-- 注册链接 -->
                        <div class="register-link">
                            <span>还没有账号？</span>
                            <v-btn color="primary" variant="text" class="register-btn-text" @click="goToRegister">
                                立即注册
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
.login-page {
    min-height: 100vh;
    position: relative;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    display: flex;
    flex-direction: column;
}

.login-content {
    margin-top: 64px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.login-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
    padding: 48px 40px;
    width: 100%;
    max-width: 450px;
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.fruit-icon {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 24px;
}

.login-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    margin: 0 0 16px 0;
}

.login-subtitle {
    font-size: 1.1rem;
    color: rgba(0, 0, 0, 0.7);
    margin: 0;
}

.login-form {
    width: 100%;
}

.form-field {
    margin-bottom: 24px;
}

.password-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    margin-bottom: 16px;
}

.forgot-password-section {
    text-align: center;
    margin-bottom: 24px;
}

.forgot-password-link {
    font-size: 14px !important;
    font-weight: 500 !important;
    min-height: auto !important;
    padding: 4px 8px !important;
}

.login-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 18px !important;
    height: 56px !important;
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3) !important;
    transition: all 0.3s ease !important;
}

.login-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(76, 175, 80, 0.4) !important;
}

.register-link {
    text-align: center;
    font-size: 16px;
}

.register-link span {
    color: rgba(0, 0, 0, 0.7);
}

.register-btn-text {
    font-size: 16px !important;
    font-weight: 600 !important;
}

/* 移动端适配 */
@media (max-width: 600px) {
    .login-content {
        margin-top: 56px;
        padding: 16px;
    }

    .login-card {
        padding: 32px 24px;
    }

    .login-title {
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
</style>
