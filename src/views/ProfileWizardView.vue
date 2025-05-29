<template>
    <div class="profile-wizard-page">
        <!-- 使用ProfileWizard组件 -->
        <ProfileWizard v-model="showWizard" @completed="handleCompleted" @close-attempt="handleCloseAttempt" />

        <!-- 如果用户尝试关闭向导，显示提示 -->
        <v-dialog v-model="showConfirmDialog" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h6">
                    确认离开
                </v-card-title>
                <v-card-text>
                    您的个人资料尚未完善，这将影响您的使用体验。确定要离开吗？
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="cancelExit">
                        继续完善
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="confirmExit">
                        离开
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AuthManager } from '@/utils/auth-manager'
import ProfileWizard from '@/components/ProfileWizard.vue'

const router = useRouter()

// 响应式数据
const showWizard = ref(true)
const showConfirmDialog = ref(false)
const isCompleted = ref(false)

// 检查认证状态
onMounted(() => {
    if (!AuthManager.isLoggedIn()) {
        console.warn('⚠️ 用户未登录，重定向到登录页')
        router.replace('/login')
        return
    }

    console.log('📝 进入资料完善页面')
})

// 监听弹窗关闭状态
watch(showWizard, (newVal) => {
    if (!newVal && !isCompleted.value) {
        // 弹窗被关闭但未完成，跳转到用户中心
        console.log('🚪 用户关闭了资料完善弹窗，跳转到用户中心')
        router.replace('/user')
    }
})

// 处理完善完成
const handleCompleted = () => {
    console.log('🎉 资料完善完成')
    isCompleted.value = true
    showWizard.value = false

    // 跳转到用户中心
    router.replace('/user')
}

// 处理关闭尝试（来自ProfileWizard组件）
const handleCloseAttempt = () => {
    console.log('⚠️ 用户尝试关闭资料完善弹窗')
    showConfirmDialog.value = true
}

// 取消离开
const cancelExit = () => {
    showConfirmDialog.value = false
}

// 确认离开
const confirmExit = () => {
    showConfirmDialog.value = false
    isCompleted.value = true // 标记为已处理，避免再次弹窗

    // 直接关闭弹窗并跳转
    showWizard.value = false
    router.replace('/user')
}
</script>

<style scoped>
.profile-wizard-page {
    height: 100vh;
    overflow: hidden;
}
</style>
