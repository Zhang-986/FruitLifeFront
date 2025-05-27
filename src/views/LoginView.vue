<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
    email: '',
    password: ''
})

const formValid = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const emailRules = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
    (v: string) => !!v || '密码不能为空'
]

const handleLogin = async () => {
    if (!formValid.value) return

    loading.value = true
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
    router.push('/')
}

const goToRegister = () => {
    router.push('/register')
}
</script>

<template>
    <div class="login-container">
        <v-container>
            <v-row justify="center" align="center" class="fill-height">
                <v-col cols="5">
                    <v-card class="fruit-card pa-12" elevation="24" rounded="xl">
                        <div class="text-center mb-10">
                            <div class="fruit-icon mb-6">🍊</div>
                            <v-card-title class="text-h3 font-weight-bold text-center fruit-gradient-text mb-4">
                                欢迎回来
                            </v-card-title>
                            <v-card-subtitle class="text-h5 text-center opacity-80">
                                登录您的水果生活账户
                            </v-card-subtitle>
                        </div>

                        <v-form v-model="formValid" @submit.prevent="handleLogin">
                            <v-text-field v-model="formData.email" label="邮箱地址" prepend-inner-icon="mdi-email"
                                :rules="emailRules" variant="outlined" class="mb-6" rounded="lg" density="comfortable"
                                style="font-size: 18px;"></v-text-field>

                            <v-text-field v-model="formData.password" label="密码" prepend-inner-icon="mdi-lock"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                                class="mb-8" rounded="lg" density="comfortable" style="font-size: 18px;"
                                @click:append-inner="showPassword = !showPassword"></v-text-field>

                            <v-btn :disabled="!formValid" :loading="loading" color="primary" variant="elevated"
                                size="x-large" rounded="xl" block class="mb-8 login-btn" type="submit"
                                style="height: 64px; font-size: 20px;">
                                <v-icon start size="large">mdi-login</v-icon>
                                立即登录
                            </v-btn>

                            <div class="text-center">
                                <span class="text-h6 opacity-70">还没有账号？</span>
                                <v-btn color="primary" variant="text" class="font-weight-bold ml-3 text-h6"
                                    @click="goToRegister">
                                    立即注册
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.fill-height {
    min-height: calc(100vh - 80px);
}

.fruit-icon {
    font-size: 6rem;
    line-height: 1;
}

.fruit-gradient-text {
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.login-btn {
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%) !important;
    color: white !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    box-shadow: 0 12px 40px rgba(255, 152, 0, 0.4) !important;
    transition: all 0.3s ease !important;
}

.login-btn:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 20px 60px rgba(255, 152, 0, 0.5) !important;
}

.fruit-card {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.95) !important;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15) !important;
    max-width: 500px;
    margin: 0 auto;
}

/* 输入框样式增强 */
:deep(.v-field) {
    font-size: 18px !important;
    min-height: 64px !important;
}

:deep(.v-field__input) {
    font-size: 18px !important;
    padding: 16px !important;
}

:deep(.v-field--focused) {
    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.3) !important;
}

:deep(.v-field__prepend-inner) {
    padding-top: 20px !important;
}

:deep(.v-field__append-inner) {
    padding-top: 20px !important;
}

/* 标签样式 */
:deep(.v-label) {
    font-size: 16px !important;
    font-weight: 500 !important;
}
</style>
