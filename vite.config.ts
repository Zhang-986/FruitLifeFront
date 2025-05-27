import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss'
      }
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true
    }),
    Components({
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 添加开发服务器代理配置
  server: {
    open: true, // 启动时自动打开浏览器
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 明确指定端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('发送请求到后端:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('收到后端响应:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
