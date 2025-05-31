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
                                    <div class="d-flex align-center justify-space-between mb-4">
                                        <h3 class="section-title">
                                            <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                                            个人信息
                                        </h3>
                                        <!-- 编辑按钮 -->
                                        <v-btn color="primary" variant="outlined" size="small" @click="openEditDialog"
                                            class="edit-profile-btn">
                                            <v-icon start size="small">mdi-pencil</v-icon>
                                            编辑资料
                                        </v-btn>
                                    </div>

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

                                        <!-- 身高体重 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="blue" class="info-icon">mdi-human-male-height</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">身高体重</div>
                                                    <div class="info-value">
                                                        {{ getHeightWeight() }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- BMI指数 -->
                                        <v-col cols="12" sm="6" v-if="userInfo?.bmiValue">
                                            <div class="info-item">
                                                <v-icon color="success" class="info-icon">mdi-chart-line</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">BMI指数</div>
                                                    <div class="info-value">
                                                        {{ userInfo.bmiValue }} ({{ getBMICategory(userInfo.bmiValue)
                                                        }})
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>

                                        <!-- 邮箱 -->
                                        <v-col cols="12" sm="6">
                                            <div class="info-item">
                                                <v-icon color="orange" class="info-icon">mdi-email</v-icon>
                                                <div class="info-content">
                                                    <div class="info-label">邮箱</div>
                                                    <div class="info-value">
                                                        {{ userInfo?.email || '未设置' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>

                                    <!-- 新增：管理员入口区域 -->
                                    <div v-if="authStore.isAdmin" class="admin-section mt-6">
                                        <v-divider class="mb-4"></v-divider>
                                        <div class="d-flex align-center justify-space-between mb-4">
                                            <h3 class="section-title">
                                                <v-icon color="error" class="mr-2">mdi-shield-crown</v-icon>
                                                管理员功能
                                            </h3>
                                            <v-chip color="error" variant="elevated" size="small">
                                                <v-icon start size="small">mdi-crown</v-icon>
                                                管理员权限
                                            </v-chip>
                                        </div>

                                        <v-card class="admin-access-card" variant="outlined" rounded="lg">
                                            <v-card-text class="pa-4">
                                                <div class="d-flex align-items-center">
                                                    <div class="admin-icon-container">
                                                        <v-avatar size="60" color="error">
                                                            <v-icon color="white" size="30">mdi-fruit-cherries</v-icon>
                                                        </v-avatar>
                                                    </div>
                                                    <div class="admin-info flex-grow-1 ml-4">
                                                        <h4 class="admin-title">水果管理系统</h4>
                                                        <p class="admin-description text-medium-emphasis">
                                                            管理水果信息，包含详细属性和生活化特性
                                                        </p>
                                                    </div>
                                                    <v-btn color="error" variant="elevated" size="large"
                                                        @click="goToAdminPanel" class="admin-btn">
                                                        <v-icon start>mdi-cog</v-icon>
                                                        进入管理
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <!-- 个人资料编辑弹窗 -->
        <ProfileEditDialog v-model="showEditDialog" :user-info="userInfo" @profile-updated="handleProfileUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAvatarStore } from '@/stores/avatar'
import AppNavigation from '@/components/AppNavigation.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import ProfileEditDialog from '@/components/ProfileEditDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const avatarStore = useAvatarStore()

// 新增：编辑弹窗状态
const showEditDialog = ref(false)

// 使用缓存的用户信息，避免重复请求
const userInfo = computed(() => authStore.userProfile)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentAvatarType = ref('emoji')

// 计算属性：是否显示管理员区域
const showAdminSection = computed(() => {
    return authStore.isAdmin && authStore.adminStatusChecked
})

// 计算属性
const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.email?.split('@')[0] || '用户'
})

const userEmail = computed(() => {
    return userInfo.value?.email || '未设置'
})

const userCompletionStatus = computed(() => authStore.userCompletionStatus)

// 获取用户头像信息
const getUserAvatarInfo = () => {
    const email = userEmail.value
    const nickname = displayName.value

    return {
        email: email !== '未设置' ? email : undefined,
        nickname: userInfo.value?.nickname || nickname,
        id: userInfo.value?.id
    }
}

// 性别相关方法
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

const getGenderText = (gender?: string) => {
    switch (gender) {
        case 'MALE': return '男性'
        case 'FEMALE': return '女性'
        case 'UNKNOWN': return '暂不透露'
        default: return '未设置'
    }
}

// 获取身高体重信息
const getHeightWeight = () => {
    if (userInfo.value?.heightCm && userInfo.value?.weightKg) {
        return `${userInfo.value.heightCm}cm / ${userInfo.value.weightKg}kg`
    }
    return '未设置'
}

// 获取BMI分类
const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return '偏瘦'
    if (bmi < 24) return '正常'
    if (bmi < 28) return '偏胖'
    return '肥胖'
}

// 头像编辑处理
const handleAvatarEdit = () => {
    // 头像编辑逻辑
}

// 新增方法：打开编辑弹窗
const openEditDialog = () => {
    if (!userInfo.value) {
        return
    }
    showEditDialog.value = true
}

// 新增方法：处理资料更新
const handleProfileUpdated = (updatedUserInfo: any) => {
    authStore.updateUserProfile(updatedUserInfo)
}

// 新增方法：强制检查管理员权限
const forceCheckAdmin = async () => {
    const email = userInfo.value?.email || authStore.getUserInfo()?.email
    if (email) {
        authStore.clearAdminStatus()
        await authStore.checkAdmin(email)
    }
}

// 新增方法：进入管理员面板
const goToAdminPanel = () => {
    router.push('/zzk')
}

// 清理监听器中的调试信息
watch(userInfo, async (newUserInfo) => {
    if (newUserInfo?.email && !authStore.adminStatusChecked) {
        await authStore.checkAdmin(newUserInfo.email)
    }
}, { deep: true })

watch(() => authStore.getUserInfo(), async (newAuthInfo) => {
    if (newAuthInfo?.email && !authStore.adminStatusChecked) {
        await authStore.checkAdmin(newAuthInfo.email)
    }
}, { deep: true })

// 页面挂载时检查登录状态和加载用户信息
onMounted(async () => {
    if (!isLoggedIn.value) {
        router.replace('/login')
        return
    }

    if (!authStore.userProfileLoaded) {
        await authStore.loadUserProfile()
    }

    if (!authStore.adminStatusChecked && userInfo.value?.email) {
        await authStore.checkAdmin(userInfo.value.email)
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
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
}

.profile-info-grid {
    margin-top: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 12px;
    background: rgba(76, 175, 80, 0.02);
    border: 1px solid rgba(76, 175, 80, 0.1);
    transition: all 0.3s ease;
}

.info-item:hover {
    background: rgba(76, 175, 80, 0.05);
    border-color: rgba(76, 175, 80, 0.2);
    transform: translateY(-1px);
}

.info-icon {
    margin-right: 12px;
    flex-shrink: 0;
}

.info-content {
    flex: 1;
}

.info-label {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 2px;
    font-weight: 500;
}

.info-value {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
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

/* 新增样式：编辑按钮 */
.edit-profile-btn {
    transition: all 0.3s ease;
    border-width: 2px !important;
}

.edit-profile-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    background-color: rgba(76, 175, 80, 0.05) !important;
}

/* 新增：管理员功能样式 */
.admin-section {
    background: linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(233, 30, 99, 0.05) 100%);
    border-radius: 16px;
    padding: 20px;
    border: 2px solid rgba(244, 67, 54, 0.1);
}

.admin-access-card {
    transition: all 0.3s ease;
    border: 2px solid rgba(244, 67, 54, 0.2) !important;
}

.admin-access-card:hover {
    border-color: rgba(244, 67, 54, 0.4) !important;
    box-shadow: 0 8px 24px rgba(244, 67, 54, 0.15) !important;
    transform: translateY(-2px);
}

.admin-icon-container {
    position: relative;
}

.admin-icon-container::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.8;
}

.admin-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #d32f2f;
    margin-bottom: 4px;
}

.admin-description {
    font-size: 0.9rem;
    margin: 0;
}

.admin-btn {
    background: linear-gradient(135deg, #f44336 0%, #e91e63 100%) !important;
    box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4) !important;
    transition: all 0.3s ease;
}

.admin-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.5) !important;
}

.debug-section {
    font-family: monospace;
    font-size: 0.875rem;
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
