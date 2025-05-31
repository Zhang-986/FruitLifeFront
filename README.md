# 🍎 水果生活前端应用

> 基于 Vue 3 + TypeScript + Vuetify 的现代化水果管理应用

[![部署状态](https://github.com/yourusername/FruitLifeFront/workflows/🚀%20部署到%20GitHub%20Pages/badge.svg)](https://github.com/yourusername/FruitLifeFront/actions)

## 🌟 在线访问

🌐 **GitHub Pages**: [https://yourusername.github.io/FruitLifeFront/](https://yourusername.github.io/FruitLifeFront/)

## 🚀 快速开始

### 本地开发
```bash
# 克隆项目
git clone https://github.com/yourusername/FruitLifeFront.git
cd FruitLifeFront

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 部署到 GitHub Pages

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: 初始化项目"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 在 GitHub 仓库中，进入 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 推送到 main 分支会自动触发部署

3. **访问你的应用**
   - 部署完成后访问: `https://你的用户名.github.io/FruitLifeFront/`

## 📦 项目特色

- ⚡ **Vue 3 组合式 API** - 现代化开发体验
- 🎨 **Vuetify 3** - Material Design 组件库
- 📱 **响应式设计** - 完美适配移动端
- 🔐 **JWT 认证** - 安全的用户认证系统
- 🍎 **图片自动获取** - 集成多个免费图片API
- 🎯 **TypeScript** - 完整的类型安全
- 🚀 **自动部署** - GitHub Actions CI/CD

## 🛠️ 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **UI组件库**: Vuetify 3
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **部署平台**: GitHub Pages

## 📋 可用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
```

## 🔧 环境配置

### 开发环境 (.env.development)
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=水果生活 - 开发版
```

### 生产环境 (.env.production)
```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=水果生活
```

## 🏗️ 项目结构

```
src/
├── api/                 # API接口
├── components/          # 公共组件
├── views/              # 页面组件
├── stores/             # Pinia状态管理
├── router/             # 路由配置
├── utils/              # 工具函数
└── styles/             # 全局样式
```

## 📱 主要功能

- 🔐 用户注册/登录
- 👤 个人资料管理
- 🍎 水果信息管理
- 📊 数据可视化
- 🛒 购物车功能
- 💳 订单管理

## 🤝 开发规范

请查看 [开发规范文档](./DEVELOPMENT-RULES.md) 了解详细的开发指导。

## 📄 开源协议

[MIT License](./LICENSE)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
