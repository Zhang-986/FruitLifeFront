<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { AuthManager } from '@/utils/auth-manager'

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
const rememberPassword = ref(true) // 默认勾选记住密码

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

// 从localStorage恢复记住的账号密码
const loadRememberedCredentials = () => {
    if (localStorage.getItem('rememberPassword') === 'true') {
        const savedEmail = localStorage.getItem('savedEmail')
        const savedPassword = localStorage.getItem('savedPassword')

        if (savedEmail) formData.value.email = savedEmail
        if (savedPassword) formData.value.password = savedPassword
        rememberPassword.value = true

        console.log('已恢复记住的登录信息')
    }
}

// 保存或清除记住的账号密码
const handleRememberPassword = () => {
    if (rememberPassword.value) {
        localStorage.setItem('rememberPassword', 'true')
        localStorage.setItem('savedEmail', formData.value.email)
        localStorage.setItem('savedPassword', formData.value.password)
        console.log('已保存登录信息到本地')
    } else {
        localStorage.removeItem('rememberPassword')
        localStorage.removeItem('savedEmail')
        localStorage.removeItem('savedPassword')
        console.log('已清除记住的登录信息')
    }
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
            // 处理记住密码
            handleRememberPassword()

            // 使用AuthManager保存token
            console.log('🔐 保存token和用户信息...')
            AuthManager.saveToken(response.data, formData.value.email)

            // 调试存储状态
            AuthManager.debugStorage()

            showMessage('登录成功！正在跳转到用户中心...', 'success')

            // 短暂延迟后跳转，确保token已保存
            setTimeout(() => {
                console.log('🚀 准备跳转到用户中心')
                console.log('🔍 跳转前最后检查登录状态:', AuthManager.isLoggedIn())

                // 直接使用router.replace而不是push，避免可以后退到登录页
                router.replace('/user').then(() => {
                    console.log('✅ 跳转成功')
                }).catch((error) => {
                    console.error('❌ 跳转失败:', error)
                    // 如果跳转失败，直接刷新页面
                    window.location.href = '/user'
                })
            }, 500)
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

const goToRegister = () => {
    router.push('/register')
}

const goToForgotPassword = () => {
    router.push('/forgot-password')
}

// 页面加载时恢复记住的登录信息
onMounted(() => {
    loadRememberedCredentials()

    console.log('🔍 LoginView加载，检查登录状态')
    AuthManager.debugStorage()

    if (AuthManager.isLoggedIn()) {
        console.log('✅ 已登录，重定向到用户中心')
        router.replace('/user')
    }
})
</script>

<template>
    <div class="login-wrapper">
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
                            density="comfortable" autocomplete="email" name="email" type="email"></v-text-field>

                        <!-- 密码输入 -->
                        <v-text-field v-model="formData.password" label="密码" prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                            class="form-field" rounded="lg" density="comfortable" autocomplete="current-password"
                            name="password" @click:append-inner="showPassword = !showPassword"></v-text-field>

                        <!-- 记住密码选项 -->
                        <div class="remember-section">
                            <v-checkbox v-model="rememberPassword" label="记住密码" color="primary" density="compact"
                                hide-details></v-checkbox>

                            <v-btn color="primary" variant="text" size="small" class="forgot-password-link"
                                @click="goToForgotPassword">
                                忘记密码？
                            </v-btn>
                        </div>

                        <!-- 登录按钮 - 移除@click事件，只保留type="submit" -->
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
.login-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.login-content {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
}

.login-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
    padding: 48px 40px;
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
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
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

.remember-section {
    margin-top: -8px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.forgot-password-link {
    font-size: 14px !important;
    font-weight: 500 !important;
    min-height: auto !important;
    padding: 4px 8px !important;
}

.login-btn {
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 18px !important;
    height: 56px !important;
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3) !important;
    transition: all 0.3s ease !important;
}

.login-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(255, 152, 0, 0.4) !important;
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
    box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.3) !important;
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
