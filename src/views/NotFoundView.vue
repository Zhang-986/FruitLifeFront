<template>
    <div class="not-found-container">
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" md="8" class="text-center">
                    <div class="error-content">
                        <div class="error-icon mb-6">
                            🍎
                        </div>
                        <h1 class="text-h2 font-weight-bold mb-4">
                            页面未找到
                        </h1>
                        <p class="text-h6 mb-6 text-medium-emphasis">
                            抱歉，您访问的页面不存在或已被移动
                        </p>
                        <div class="action-buttons">
                            <v-btn color="primary" variant="elevated" size="large" rounded="xl" @click="goHome"
                                class="mr-4">
                                <v-icon start>mdi-home</v-icon>
                                返回首页
                            </v-btn>
                            <v-btn variant="outlined" size="large" rounded="xl" @click="goBack">
                                <v-icon start>mdi-arrow-left</v-icon>
                                返回上页
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/')
}

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}
</script>

<style scoped>
.not-found-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.error-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.error-icon {
    font-size: 8rem;
    line-height: 1;
}

.action-buttons {
    margin-top: 24px;
}

@media (max-width: 600px) {
    .error-content {
        padding: 32px 24px;
    }

    .error-icon {
        font-size: 6rem;
    }

    .action-buttons .v-btn {
        width: 100%;
        margin: 8px 0;
    }
}
</style>
