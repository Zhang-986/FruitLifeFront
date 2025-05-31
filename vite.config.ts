import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 判断是否为GitHub Pages构建
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
  
  // GitHub Pages的仓库名称 - 根据你的用户名和仓库名修改
  const repoName = 'FruitLifeFront'  // 改为你的实际仓库名
  
  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: true
      }),
      Components({
        dts: true
      })
    ],
    
    // 🔧 GitHub Pages部署关键配置
    base: isGitHubPages ? `/${repoName}/` : '/',
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    
    // 🏗️ 生产构建优化
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            vuetify: ['vuetify'],
          }
        }
      }
    },
    
    // 🛠️ 开发服务器配置
    server: {
      open: true,
      host: '0.0.0.0',
      port: 5173,
      hmr: {
        overlay: true
      },
      watch: {
        usePolling: true,
        interval: 1000
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // 🎯 环境变量配置
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }
  }
})
