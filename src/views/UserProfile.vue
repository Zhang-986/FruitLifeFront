<template>
    <div class="user-profile-page">
        <!-- 使用统一的导航组件 -->
        <AppNavigation />

        <!-- 主要内容区域 -->
        <div class="profile-content">
            <v-container class="pa-6">
                <!-- 个人信息卡片 -->
                <v-row justify="center">
                    <v-col cols="12" md="8" lg="6">
                        <v-card class="profile-card fruit-card" elevation="8" rounded="xl">
                            <!-- 头像区域 -->
                            <div class="profile-header fruit-gradient">
                                <div class="avatar-section">
                                    <div class="avatar-wrapper">
                                        <UserAvatar :user="getUserAvatarInfo()" :size="120"
                                            :avatar-type="currentAvatarType" editable @edit="handleAvatarEdit"
                                            class="profile-avatar" />
                                        <!-- 编辑提示 -->
                                        <div class="avatar-hint">
                                            <v-icon size="small" color="white" class="mr-1">mdi-camera</v-icon>
                                            <span class="text-caption text-white">点击编辑头像</span>
                                        </div>
                                    </div>
                                    <div class="profile-basic-info">
                                        <h2 class="profile-name text-white">{{ displayName }}</h2>
                                        <p class="profile-email text-white opacity-90">{{ userEmail }}</p>
                                        <!-- 完善状态 -->
                                        <v-chip :color="userCompletionStatus.color" variant="elevated" class="mt-2">
                                            <v-icon start size="small">{{ userCompletionStatus.icon }}</v-icon>
                                            {{ userCompletionStatus.text }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>

                            <!-- 详细信息区域 -->
                            <v-card-text class="pa-6">
                                <div class="profile-details">
                                    <h3 class="section-title mb-4">
                                        <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                                        个人信息
                                    </h3>

                                    <v-row class="profile-info-grid">
                                        <!-- 昵称 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="primary" class="info-icon">mdi-account</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">昵称</div>
                                                    <div class="info-value">
                                                        {{ userInfo?.nickname || '未设置' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- 年龄 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="pink" class="info-icon">mdi-cake-variant</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">年龄</div>
                                                    <div class="info-value">
                                                        {{ userInfo?.age ? `${userInfo.age} 岁` : '未设置' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- 性别 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon :color="getGenderColor(userInfo?.gender)" class="info-icon">
                                                    {{ getGenderIcon(userInfo?.gender) }}
                                                </v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">性别</div>
                                                    <div class="info-value">
                                                        {{ getGenderText(userInfo?.gender) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- BMI -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="blue" class="info-icon">mdi-chart-line</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">BMI指数</div>
                                                    <div class="info-value">
                                                        <span v-if="userInfo?.bmiValue">
                                                            {{ userInfo.bmiValue }}
                                                            <v-chip size="small" :color="getBMIColor(userInfo.bmiValue)"
                                                                class="ml-2">
                                                                {{ getBMICategory(userInfo.bmiValue) }}
                                                            </v-chip>
                                                        </span>
                                                        <span v-else>未设置</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- 身高 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="green" class="info-icon">mdi-human-male-height</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">身高</div>
                                                    <div class="info-value">
                                                        {{ userInfo?.heightCm ? `${userInfo.heightCm} cm` : '未设置' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- 体重 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="orange" class="info-icon">mdi-scale-bathroom</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">体重</div>
                                                    <div class="info-value">
                                                        {{ userInfo?.weightKg ? `${userInfo.weightKg} kg` : '未设置' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="profile-actions mt-6">
                                    <v-btn color="primary" variant="elevated" size="large" rounded="xl"
                                        @click="editProfile" class="mr-4">
                                        <v-icon start>mdi-pencil</v-icon>
                                        编辑资料
                                    </v-btn>
                                    <v-btn color="success" variant="outlined" size="large" rounded="xl"
                                        @click="handleAvatarEdit">
                                        <v-icon start>mdi-camera</v-icon>
                                        更换头像
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <!-- 头像选择器 -->
        <AvatarSelector v-model="showAvatarSelector" :user="getUserAvatarInfo()"
            :current-avatar-type="currentAvatarType" @select="handleAvatarSelect" />

        <!-- 加载状态 -->
        <v-overlay v-model="loading" contained class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="primary" size="64" indeterminate class="mb-4"></v-progress-circular>
                <div class="text-h6">加载中...</div>
            </div>
        </v-overlay>

        <!-- 提示信息 -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getUserInfo, checkUserInfoCompleted, type UserInfoVo } from '@/api/profile'
import AppNavigation from '@/components/AppNavigation.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AvatarSelector from '@/components/AvatarSelector.vue'

const router = useRouter()
const authStore = useAuthStore()

// 本地类型定义，与AvatarSelector保持一致
type AvatarType = 'letter' | 'emoji' | 'fruit' | 'color'

interface AvatarConfig {
    type: AvatarType
    fruit?: string
    emoji?: string
    color?: string
}

// 响应式数据
const userInfo = ref<UserInfoVo | null>(null)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 头像相关状态
const showAvatarSelector = ref(false)
const currentAvatarType = ref<AvatarType>('fruit')

// 计算属性
const displayName = computed(() => {
    return userInfo.value?.nickname || authStore.displayName || '用户'
})

const userEmail = computed(() => {
    const authInfo = authStore.getUserInfo()
    return authInfo?.email || userInfo.value?.email || '未知邮箱'
})

const userCompletionStatus = computed(() => {
    if (!userInfo.value) {
        return {
            color: 'warning',
            icon: 'mdi-loading',
            text: '加载中...'
        }
    }

    if (userInfo.value.isCompleted) {
        return {
            color: 'success',
            icon: 'mdi-check-circle',
            text: '资料完整'
        }
    } else {
        return {
            color: 'warning',
            icon: 'mdi-alert-circle',
            text: '待完善'
        }
    }
})

// 方法
const showMessage = (message: string, color: string = 'success') => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// 获取用户头像信息 - 与导航栏保持一致
const getUserAvatarInfo = () => {
    return {
        email: userEmail.value !== '未知邮箱' ? userEmail.value : undefined,
        nickname: displayName.value,
        id: userInfo.value?.id
    }
}

// 处理头像编辑
const handleAvatarEdit = () => {
    console.log('🎨 打开头像选择器')
    showAvatarSelector.value = true
}

// 处理头像选择
const handleAvatarSelect = (config: AvatarConfig) => {
    console.log('✅ 头像选择配置:', config)
    currentAvatarType.value = config.type
    showMessage('头像已更新', 'success')

    // TODO: 这里可以保存头像配置到后端
    console.log('保存头像配置:', config)
}

// 编辑资料
const editProfile = () => {
    router.push('/user/profile-wizard')
}

// 性别相关方法
const getGenderText = (gender?: 'MALE' | 'FEMALE' | 'UNKNOWN') => {
    switch (gender) {
        case 'MALE': return '男性'
        case 'FEMALE': return '女性'
        case 'UNKNOWN': return '暂不透露'
        default: return '未设置'
    }
}

const getGenderColor = (gender?: 'MALE' | 'FEMALE' | 'UNKNOWN') => {
    switch (gender) {
        case 'MALE': return 'blue'
        case 'FEMALE': return 'pink'
        case 'UNKNOWN': return 'grey'
        default: return 'grey'
    }
}

const getGenderIcon = (gender?: 'MALE' | 'FEMALE' | 'UNKNOWN') => {
    switch (gender) {
        case 'MALE': return 'mdi-human-male'
        case 'FEMALE': return 'mdi-human-female'
        case 'UNKNOWN': return 'mdi-help'
        default: return 'mdi-help'
    }
}

// BMI相关方法
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

// 加载用户信息
const loadUserInfo = async () => {
    loading.value = true
    try {
        console.log('🔍 开始获取用户信息...')
        const response = await getUserInfo()

        if (response.code === 200 && response.data) {
            userInfo.value = response.data
            console.log('✅ 用户信息加载成功:', userInfo.value)
        } else {
            showMessage(response.msg || '获取用户信息失败', 'error')
        }
    } catch (error: any) {
        console.error('❌ 获取用户信息失败:', error)

        let message = '获取用户信息失败，请稍后重试'
        if (error.name === 'BusinessError') {
            message = error.message
        }

        showMessage(message, 'error')
    } finally {
        loading.value = false
    }
}

// 页面加载时获取用户信息
onMounted(async () => {
    if (authStore.isLoggedIn) {
        await loadUserInfo()
    } else {
        router.replace('/login')
    }
})
</script>

<style scoped>
.user-profile-page {
    min-height: 100vh;
    background: #f5f5f5;
}

.profile-content {
    margin-top: 64px;
    padding: 24px 0;
}

.profile-card {
    overflow: hidden;
}

.profile-header {
    padding: 40px 24px;
    text-align: center;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.avatar-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.profile-avatar {
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.profile-avatar:hover {
    transform: scale(1.05);
}

.avatar-hint {
    display: flex;
    align-items: center;
    opacity: 0.8;
    transition: all 0.3s ease;
}

.avatar-wrapper:hover .avatar-hint {
    opacity: 1;
    transform: translateY(-2px);
}

.profile-basic-info {
    text-align: center;
}

.profile-name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-email {
    font-size: 1.1rem;
    margin-bottom: 12px;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: #333;
}

.profile-info-grid {
    margin-top: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: rgba(76, 175, 80, 0.05);
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(76, 175, 80, 0.1);
}

.info-item:hover {
    background: rgba(76, 175, 80, 0.1);
    border-color: rgba(76, 175, 80, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.info-icon {
    margin-right: 16px;
    background: white;
    padding: 8px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-content {
    flex: 1;
}

.info-label {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
    font-weight: 500;
}

.info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
}

.profile-actions {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.profile-actions .v-btn {
    transition: all 0.3s ease;
}

.profile-actions .v-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 移动端适配 */
@media (max-width: 600px) {
    .profile-content {
        margin-top: 56px;
        padding: 16px 0;
    }

    .profile-header {
        padding: 32px 16px;
    }

    .profile-name {
        font-size: 1.75rem;
    }

    .avatar-section {
        gap: 16px;
    }

    .profile-actions {
        text-align: center;
    }

    .profile-actions .v-btn {
        width: 100%;
        margin-bottom: 12px;
        margin-right: 0 !important;
    }

    .info-item {
        flex-direction: column;
        text-align: center;
        gap: 8px;
    }

    .info-icon {
        margin-right: 0;
        margin-bottom: 8px;
    }
}

/* 动画效果 */
.profile-card {
    animation: slideUpFadeIn 0.6s ease-out;
}

@keyframes slideUpFadeIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.info-item {
    animation: fadeInUp 0.4s ease-out;
    animation-fill-mode: both;
}

.info-item:nth-child(1) {
    animation-delay: 0.1s;
}

.info-item:nth-child(2) {
    animation-delay: 0.2s;
}

.info-item:nth-child(3) {
    animation-delay: 0.3s;
}

.info-item:nth-child(4) {
    animation-delay: 0.4s;
}

.info-item:nth-child(5) {
    animation-delay: 0.5s;
}

.info-item:nth-child(6) {
    animation-delay: 0.6s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 深色主题支持 */
.v-theme--dark .info-item {
    background: rgba(76, 175, 80, 0.1);
    border-color: rgba(76, 175, 80, 0.2);
}

.v-theme--dark .info-item:hover {
    background: rgba(76, 175, 80, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
}

.v-theme--dark .info-value {
    color: white;
}

.v-theme--dark .section-title {
    color: white;
}
</style>
