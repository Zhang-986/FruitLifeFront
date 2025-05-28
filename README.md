# 🍎 果润生活 FruitLife Frontend

一个基于 Vue 3 + Vuetify 的现代化水果商城前端项目，采用清新的Google Material Design风格。

## ✨ 特性

- 🎨 清新的水果主题设计
- 📱 完全响应式设计，支持移动端和桌面端
- 🍔 汉堡菜单侧边导航栏
- 🌙 明暗主题切换
- 🔍 实时搜索功能
- 🛒 购物车功能
- 💫 流畅的动画效果
- 🎯 按需导入组件，优化性能
- 🔐 JWT用户认证系统
- 🎪 轮播图展示
- 🏪 商品分类导航
- 👤 用户中心管理

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **UI库**: Vuetify 3
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **图标**: Material Design Icons
- **样式**: SCSS
- **HTTP客户端**: Axios
- **认证**: JWT Token

## 🎨 主题色彩

- **主色调**: 清新绿色 (#4CAF50) - 苹果绿
- **次要色**: 活力橙色 (#FF9800) - 橙子色  
- **强调色**: 粉红色 (#E91E63) - 草莓色
- **成功色**: 浅绿色 (#8BC34A) - 青苹果色
- **警告色**: 柠檬黄 (#FFC107)

## 🚀 推荐IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur)

## 📦 项目设置

```sh
npm install
```

### 🔥 开发环境运行

```sh
npm run dev
```

### 🏗️ 生产环境构建

```sh
npm run build
```

### 🔍 代码检查

```sh
npm run lint
```

### 🎯 代码格式化

```sh
npm run format
```

## 📁 项目结构

```
src/
├── components/     # 公共组件
├── views/         # 页面组件
│   ├── user/      # 用户相关页面
│   └── ...
├── router/        # 路由配置
├── stores/        # Pinia状态管理
│   └── auth.ts    # 认证状态管理
├── utils/         # 工具函数
│   ├── auth-manager.ts    # 认证管理器
│   ├── ip-resolver.ts     # IP解析工具
│   └── request-interceptor.ts  # 请求拦截器
├── plugins/       # 插件配置
├── styles/        # 样式文件
│   ├── main.scss     # 主样式文件
│   ├── variables.scss # 变量定义
│   ├── mixins.scss   # 混合器
│   └── settings.scss # Vuetify设置
└── assets/        # 静态资源
```

## 🎪 功能模块

### ✅ 已完成
- [x] 用户登录注册系统
- [x] JWT Token认证
- [x] 响应式导航栏设计
- [x] 汉堡菜单侧边栏
- [x] 用户中心界面
- [x] 主页轮播图
- [x] 商品展示卡片
- [x] 路由守卫
- [x] 状态管理(Pinia)
- [x] IP地址获取
- [x] 请求拦截器

### 🚧 开发中
- [ ] 水果商品详情页面
- [ ] 购物车功能完善
- [ ] 订单管理系统
- [ ] 支付集成
- [ ] 用户评价系统
- [ ] 商品搜索功能
- [ ] 收藏夹功能

### 🔮 计划中
- [ ] 实时通知系统
- [ ] 多语言支持
- [ ] PWA支持
- [ ] 数据分析面板
- [ ] 商品推荐算法
- [ ] 社交分享功能

## 🔗 API接口

项目配置了代理转发到后端API：
- 开发环境: `http://localhost:8080`
- 请求前缀: `/api`

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---
🍓 让我们一起打造最棒的水果购物体验！
