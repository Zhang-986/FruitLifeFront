<!-- filepath: d:\ItCast\git\FruitLifeFront\src\components\UserInfoNotification.vue -->
<template>
    <!-- 贴边滑出式通知弹窗 -->
    <Transition name="slide-notification" enter-active-class="transform transition ease-out duration-500"
        enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transform transition ease-in duration-300" leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0">
        <div v-if="showNotification" :style="{
            position: 'fixed',
            top: '0',
            right: '0',
            zIndex: 9999,
            width: '360px',
            backgroundColor: notificationType === 'success' ? '#52c41a' : '#1890ff',
            borderRadius: '0 0 0 20px',
            boxShadow: '-4px 4px 20px rgba(0,0,0,0.25)',
            padding: '24px 20px',
            fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
            color: 'white',
            marginTop: '20px'
        }">
            <!-- 关闭按钮 -->
            <button ref="closeBtn" @click="dismiss" @mouseenter="handleCloseHover" @mouseleave="handleCloseLeave"
                :style="closeButtonStyle">
                ×
            </button>

            <!-- 内容区域 -->
            <div style="display: flex; align-items: flex-start; gap: 16px;">
                <!-- 图标 -->
                <div :style="{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '28px',
                    flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.2)'
                }">
                    {{ notificationType === 'success' ? '🎉' : '🍎' }}
                </div>

                <!-- 文本内容 -->
                <div style="flex: 1; padding-right: 30px;">
                    <div style="font-weight: bold; margin-bottom: 6px; font-size: 18px; line-height: 1.2;">
                        {{ notificationType === 'success' ? '太棒了！' : '嗨，果友' }}
                    </div>
                    <div style="font-size: 14px; opacity: 0.95; line-height: 1.4; margin-bottom: 16px;">
                        {{ message }}
                    </div>

                    <!-- 按钮区域 - 内联显示 -->
                    <div style="display: flex; gap: 10px;">
                        <button v-if="notificationType === 'info'" ref="profileBtn" @click="goToProfile"
                            @mouseenter="handleProfileHover" @mouseleave="handleProfileLeave"
                            :style="primaryButtonStyle">
                            立即完善
                        </button>
                        <button v-else ref="journeyBtn" @click="startJourney" @mouseenter="handleJourneyHover"
                            @mouseleave="handleJourneyLeave" :style="primaryButtonStyle">
                            开始探索
                        </button>

                        <button ref="laterBtn" @click="dismiss" @mouseenter="handleLaterHover"
                            @mouseleave="handleLaterLeave" :style="secondaryButtonStyle">
                            稍后
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import { useWebSocketStore } from '@/stores/websocket'

const router = useRouter()
const webSocketStore = useWebSocketStore()

// 按钮refs
const closeBtn = ref<HTMLButtonElement>()
const profileBtn = ref<HTMLButtonElement>()
const journeyBtn = ref<HTMLButtonElement>()
const laterBtn = ref<HTMLButtonElement>()

// 计算属性
const showNotification = computed(() => webSocketStore.showInfoNotification)
const message = computed(() => webSocketStore.notificationMessage)
const notificationType = computed(() => webSocketStore.notificationType)

// 按钮样式
const closeButtonStyle = computed((): CSSProperties => ({
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    fontSize: '16px',
    cursor: 'pointer' as const,
    color: 'white',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    transition: 'all 0.2s'
}))

const primaryButtonStyle = computed((): CSSProperties => ({
    backgroundColor: 'white',
    color: notificationType.value === 'success' ? '#52c41a' : '#1890ff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}))

const secondaryButtonStyle = computed((): CSSProperties => ({
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer' as const,
    transition: 'all 0.2s'
}))

// 悬停事件处理
const handleCloseHover = () => {
    if (closeBtn.value) {
        closeBtn.value.style.backgroundColor = 'rgba(255,255,255,0.35)'
        closeBtn.value.style.transform = 'scale(1.1)'
    }
}

const handleCloseLeave = () => {
    if (closeBtn.value) {
        closeBtn.value.style.backgroundColor = 'rgba(255,255,255,0.2)'
        closeBtn.value.style.transform = 'scale(1)'
    }
}

const handleProfileHover = () => {
    if (profileBtn.value) {
        profileBtn.value.style.transform = 'translateY(-2px) scale(1.05)'
        profileBtn.value.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
    }
}

const handleProfileLeave = () => {
    if (profileBtn.value) {
        profileBtn.value.style.transform = 'translateY(0) scale(1)'
        profileBtn.value.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    }
}

const handleJourneyHover = () => {
    if (journeyBtn.value) {
        journeyBtn.value.style.transform = 'translateY(-2px) scale(1.05)'
        journeyBtn.value.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
    }
}

const handleJourneyLeave = () => {
    if (journeyBtn.value) {
        journeyBtn.value.style.transform = 'translateY(0) scale(1)'
        journeyBtn.value.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    }
}

const handleLaterHover = () => {
    if (laterBtn.value) {
        laterBtn.value.style.backgroundColor = 'rgba(255,255,255,0.3)'
        laterBtn.value.style.transform = 'scale(1.05)'
    }
}

const handleLaterLeave = () => {
    if (laterBtn.value) {
        laterBtn.value.style.backgroundColor = 'rgba(255,255,255,0.2)'
        laterBtn.value.style.transform = 'scale(1)'
    }
}

// 方法
const dismiss = () => {
    webSocketStore.dismissNotification()
}

const goToProfile = () => {
    dismiss()
    router.push('/user/profile')
}

const startJourney = () => {
    dismiss()
    router.push('/dashboard')
}
</script>

<style scoped>
/* 移除所有Vuetify相关的样式 */
</style>