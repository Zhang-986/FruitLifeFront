# 🍎 水果生活 - 产品功能规划

> 记录积分系统、AI助手等核心功能的设计思路和实现计划

## 📋 目录

- [现状分析](#现状分析)
- [核心功能设计](#核心功能设计)
- [技术架构](#技术架构)
- [实现计划](#实现计划)
- [数据库设计](#数据库设计)
- [用户体验设计](#用户体验设计)
- [商业价值](#商业价值)

---

## 🎯 现状分析

### 已完成功能
- ✅ 用户注册登录系统
- ✅ 个人资料完善（昵称、年龄、性别、身高体重、BMI计算）
- ✅ 水果数据管理（CRUD操作）
- ✅ 每日水果推荐系统
- ✅ 响应式UI设计
- ✅ 用户头像系统

### 待开发功能
- 🚧 **积分系统** - 用户行为激励机制
- 🚧 **水果商城** - 积分购买水果功能
- 🚧 **个人库存** - 用户水果收藏管理
- 🚧 **AI助手** - 个性化健康建议

---

## 🎮 核心功能设计

### 1. 积分系统 (Points System)

#### 1.1 积分获取方式
```javascript
const POINT_ACTIONS = {
  // 日常行为
  dailyLogin: 10,           // 每日登录
  dailySignIn: 20,          // 每日签到
  dailyRecommendation: 5,   // 查看每日推荐
  
  // 互动行为
  browseFruit: 2,           // 浏览水果详情
  addToFavorites: 5,        // 添加收藏
  writeReview: 30,          // 撰写水果评价
  shareContent: 15,         // 分享内容
  
  // 完成任务
  completeProfile: 100,     // 完善个人资料
  firstPurchase: 50,        // 首次购买
  dailyTask: 25,            // 完成每日任务
  
  // 连续奖励
  consecutive: {
    7days: 100,             // 连续7天登录
    30days: 500,            // 连续30天登录
    achievement: 200        // 达成成就
  }
}
```

#### 1.2 积分消费场景
- **水果购买**: 用积分购买虚拟水果添加到个人库存
- **特殊功能**: 解锁高级AI建议、专属水果品种
- **个性化服务**: 定制化营养方案、专属客服
- **实体奖励**: 积分兑换优惠券、实物水果礼盒

#### 1.3 积分等级体系
```javascript
const USER_LEVELS = [
  { level: 1, name: '水果新手', minPoints: 0, benefits: ['基础功能'] },
  { level: 2, name: '健康达人', minPoints: 500, benefits: ['每日任务', 'AI基础建议'] },
  { level: 3, name: '营养专家', minPoints: 2000, benefits: ['高级AI建议', '专属水果'] },
  { level: 4, name: '生活大师', minPoints: 5000, benefits: ['个性化方案', '专属客服'] },
  { level: 5, name: '健康导师', minPoints: 10000, benefits: ['全部功能', '社区特权'] }
]
```

---

### 2. 水果商城 (Fruit Market)

#### 2.1 商品分类
- **基础水果**: 常见水果，积分价格较低
- **特色水果**: 进口或稀有水果，积分价格较高
- **季节限定**: 应季水果，限时优惠
- **礼盒套装**: 多种水果组合，营养搭配

#### 2.2 定价策略
```javascript
const FRUIT_PRICING = {
  // 基础定价（积分）
  common: 10-30,      // 苹果、香蕉、橙子
  special: 50-100,    // 牛油果、火龙果、奇异果
  premium: 100-200,   // 进口水果、有机水果
  
  // 动态定价
  seasonal: 0.8,      // 应季水果8折
  bulk: {             // 批量购买优惠
    buy5: 0.9,        // 5个装9折
    buy10: 0.8        // 10个装8折
  },
  
  // 用户等级折扣
  levelDiscount: {
    1: 1.0,           // 无折扣
    2: 0.95,          // 95折
    3: 0.9,           // 9折
    4: 0.85,          // 85折
    5: 0.8            // 8折
  }
}
```

#### 2.3 购买机制设计
- **虚拟购买**: 重点在收集乐趣，不会真正"消费"
- **数量累积**: 可以购买多个同种水果
- **保鲜期**: 虚拟保鲜期，增加游戏化元素
- **品质等级**: 普通、优质、精品、极品

---

### 3. 个人库存 (Personal Inventory)

#### 3.1 库存管理
```javascript
const INVENTORY_STRUCTURE = {
  fruitId: Number,           // 水果ID
  fruitName: String,         // 水果名称
  quantity: Number,          // 当前数量
  quality: String,           // 品质等级
  purchaseDate: Date,        // 购买日期
  expiryDate: Date,          // 过期日期
  totalObtained: Number,     // 历史总获得
  totalConsumed: Number,     // 历史总消费（如果有虚拟消费）
  lastActivity: Date         // 最后活动时间
}
```

#### 3.2 库存分类展示
- **充足库存**: 数量>5个，绿色标识
- **适中库存**: 数量2-5个，黄色标识  
- **不足库存**: 数量1个，橙色标识
- **缺少品种**: 数量0个，灰色标识

#### 3.3 智能提醒
- **即将过期**: 提醒用户关注即将过期的水果
- **营养缺失**: 根据最近消费记录提醒补充特定营养
- **季节推荐**: 根据当前季节推荐库存中的应季水果

---

### 4. AI健康助手 (AI Health Assistant)

#### 4.1 AI分析维度
```javascript
const AI_ANALYSIS_FACTORS = {
  userProfile: {
    age: Number,              // 年龄
    gender: String,           // 性别
    bmi: Number,              // BMI指数
    healthGoals: Array,       // 健康目标
    allergies: Array,         // 过敏信息
    preferences: Array        // 口味偏好
  },
  
  inventory: {
    ownedFruits: Array,       // 拥有的水果
    quantities: Object,       // 各种水果数量
    freshness: Object,        // 新鲜度信息
    nutritionProfile: Object  // 营养成分分析
  },
  
  behavior: {
    consumptionHistory: Array,  // 消费历史
    browsingPreferences: Array, // 浏览偏好
    timePatterns: Object,       // 活动时间模式
    seasonalPreferences: Object // 季节性偏好
  },
  
  context: {
    currentSeason: String,    // 当前季节
    weatherCondition: String, // 天气情况
    timeOfDay: String,        // 时间段
    healthStatus: String      // 健康状态（如感冒、疲劳等）
  }
}
```

#### 4.2 AI对话场景
```markdown
🤖 **营养搭配建议**
用户: "我今天感觉有点累，该吃什么水果？"
AI: "根据您的库存和当前状态，建议：
- 🍌 香蕉 1根：富含钾离子，快速补充能量
- 🫐 蓝莓 50g：花青素抗氧化，缓解疲劳
- 🥝 奇异果 1个：维生素C含量高，增强免疫力

您目前库存：香蕉x3, 蓝莓x2, 奇异果x1
建议在下午3-4点食用，效果最佳。"

🤖 **购买建议**
AI: "分析您的近期消费模式，发现：
- 维生素C摄入不足，建议购买🍊橙子或🍓草莓
- 纤维素摄入良好，🍎苹果消费频率合适
- 抗氧化物质需要补充，推荐🍇葡萄或🫐蓝莓

根据您的积分余额(520分)，推荐购买：
橙子5个装(45积分) + 蓝莓2盒装(80积分) = 125积分"

🤖 **健康提醒**
AI: "早上好！今日健康提醒：
- ☀️ 今天天气晴朗，适合户外活动后补充🥭芒果
- 📅 您已连续5天摄入苹果，营养均衡很好
- ⚠️ 库存中的🍌香蕉将在2天后达到最佳食用期
- 🎯 本周维生素C目标达成80%，加油！"
```

#### 4.3 AI学习机制
- **偏好学习**: 根据用户选择调整推荐权重
- **效果反馈**: 用户可以对建议进行评价，优化算法
- **季节适应**: 根据季节变化调整推荐策略
- **个性化增强**: 长期使用后提供更精准的建议

---

## 🏗️ 技术架构

### 前端架构
```
src/
├── views/
│   ├── PointsCenter/          # 积分中心
│   ├── FruitMarket/           # 水果商城
│   ├── MyInventory/           # 我的库存
│   └── AIAssistant/           # AI助手
├── stores/
│   ├── points.ts              # 积分状态管理
│   ├── inventory.ts           # 库存管理
│   ├── market.ts              # 商城状态
│   └── ai.ts                  # AI对话状态
├── components/
│   ├── PointsDisplay/         # 积分展示组件
│   ├── FruitCard/            # 水果卡片组件
│   ├── InventoryGrid/        # 库存网格组件
│   └── AIChat/               # AI聊天组件
└── utils/
    ├── points-calculator.ts   # 积分计算工具
    ├── nutrition-analyzer.ts # 营养分析工具
    └── ai-prompts.ts         # AI提示词管理
```

### 后端API设计
```
# 积分系统
POST /api/points/earn           # 获得积分
GET  /api/points/balance        # 查询余额
GET  /api/points/history        # 积分历史
GET  /api/points/leaderboard    # 积分排行榜

# 商城系统
GET  /api/market/fruits         # 商城水果列表
POST /api/market/purchase       # 购买水果
GET  /api/market/deals          # 特价信息

# 库存系统
GET  /api/inventory/fruits      # 我的水果库存
PUT  /api/inventory/update      # 更新库存状态
GET  /api/inventory/stats       # 库存统计

# AI系统
POST /api/ai/chat              # AI对话
GET  /api/ai/suggestions       # AI推荐
POST /api/ai/feedback          # 反馈AI建议
GET  /api/ai/analysis          # 营养分析报告
```

---

## 📅 实现计划

### 第一阶段：积分系统基础 (Week 1-2)
- [ ] 积分数据库设计
- [ ] 基础积分获取逻辑
- [ ] 积分展示组件
- [ ] 每日签到功能
- [ ] 积分历史记录

### 第二阶段：水果商城 (Week 3-4)
- [ ] 商城页面设计
- [ ] 水果购买流程
- [ ] 积分支付系统
- [ ] 购买确认和反馈
- [ ] 特价和折扣系统

### 第三阶段：个人库存 (Week 5-6)
- [ ] 库存数据结构设计
- [ ] 库存展示界面
- [ ] 库存分类和筛选
- [ ] 库存统计和图表
- [ ] 智能提醒系统

### 第四阶段：AI助手基础 (Week 7-8)
- [ ] AI对话界面
- [ ] 基础营养分析
- [ ] 简单推荐算法
- [ ] 用户反馈收集
- [ ] AI提示词优化

### 第五阶段：AI助手进阶 (Week 9-10)
- [ ] 个性化推荐算法
- [ ] 复杂营养分析
- [ ] 多维度数据整合
- [ ] 学习机制实现
- [ ] 高级对话功能

### 第六阶段：系统整合优化 (Week 11-12)
- [ ] 各系统联调
- [ ] 性能优化
- [ ] 用户体验完善
- [ ] 数据统计和分析
- [ ] 测试和部署

---

## 🗄️ 数据库设计

### 积分系统表
```sql
-- 用户积分账户表
CREATE TABLE user_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    current_points INT DEFAULT 0,
    total_earned INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 积分交易记录表
CREATE TABLE point_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    transaction_type ENUM('EARN', 'SPEND') NOT NULL,
    points INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    reference_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 每日任务表
CREATE TABLE daily_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    task_date DATE NOT NULL,
    login_completed BOOLEAN DEFAULT FALSE,
    signin_completed BOOLEAN DEFAULT FALSE,
    browse_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_date (user_id, task_date)
);
```

### 库存系统表
```sql
-- 用户水果库存表
CREATE TABLE user_fruit_inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    fruit_id BIGINT NOT NULL,
    quantity INT DEFAULT 0,
    quality ENUM('NORMAL', 'GOOD', 'EXCELLENT', 'PREMIUM') DEFAULT 'NORMAL',
    purchase_points INT DEFAULT 0,
    purchase_date TIMESTAMP NULL,
    expiry_date TIMESTAMP NULL,
    total_obtained INT DEFAULT 0,
    total_consumed INT DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_fruit_quality (user_id, fruit_id, quality)
);

-- 购买记录表
CREATE TABLE purchase_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    fruit_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    quality ENUM('NORMAL', 'GOOD', 'EXCELLENT', 'PREMIUM') DEFAULT 'NORMAL',
    points_spent INT NOT NULL,
    discount_rate DECIMAL(3,2) DEFAULT 1.00,
    original_points INT NOT NULL,
    purchase_type ENUM('SINGLE', 'BULK', 'PROMOTION') DEFAULT 'SINGLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### AI系统表
```sql
-- AI对话记录表
CREATE TABLE ai_conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_data JSON,
    satisfaction_rating INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户偏好学习表
CREATE TABLE user_preferences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    preference_type ENUM('FRUIT', 'NUTRITION', 'TIME', 'SEASON') NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.00,
    learned_from ENUM('EXPLICIT', 'BEHAVIOR', 'FEEDBACK') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_preference (user_id, preference_type, preference_key)
);
```

---

## 🎨 用户体验设计

### 界面设计原则
1. **简洁直观**: 信息层次清晰，操作流程简单
2. **视觉愉悦**: 采用水果主题色彩，温馨友好
3. **即时反馈**: 每个操作都有明确的视觉反馈
4. **个性化**: 根据用户等级和偏好定制界面

### 交互设计重点
- **积分获取**: 动画效果突出积分增加，增强成就感
- **水果购买**: 简化购买流程，突出积分余额变化
- **库存管理**: 可视化展示库存状态，快速定位所需信息
- **AI对话**: 拟人化设计，让用户感受到智能伙伴的陪伴

### 移动端适配
- 响应式设计，保证各设备良好体验
- 手势操作优化，支持滑动、长按等交互
- 性能优化，确保流畅运行

---

## 💰 商业价值

### 用户价值
1. **健康管理**: 科学的营养指导和个性化建议
2. **学习成长**: 水果知识和健康意识的提升
3. **趣味体验**: 游戏化的健康管理方式
4. **社交互动**: 分享健康生活方式，建立社区

### 平台价值
1. **用户粘性**: 积分系统和AI助手增强用户粘性
2. **数据积累**: 用户行为数据为优化提供依据
3. **商业模式**: 未来可扩展到真实商品销售
4. **品牌建设**: 专业的健康管理平台形象

### 技术价值
1. **AI应用**: 积累AI在健康领域的应用经验
2. **用户画像**: 构建精准的用户健康画像
3. **推荐算法**: 开发个性化推荐系统
4. **数据分析**: 健康数据的深度挖掘和应用

---

## 🤔 讨论问题

### 待确认的设计细节
1. **积分获取上限**: 是否设置每日积分获取上限？
2. **库存过期机制**: 虚拟水果是否需要过期机制？
3. **AI收费模式**: 高级AI功能是否需要额外积分？
4. **社交功能**: 是否加入用户间的互动功能？
5. **数据隐私**: AI分析用户数据的隐私保护策略？

### 技术实现疑问
1. **AI接口选择**: 使用哪个AI服务提供商？
2. **实时性要求**: AI响应时间目标是多少？
3. **数据同步**: 多端数据同步策略？
4. **缓存策略**: 如何优化数据加载性能？
5. **扩展性**: 如何设计支持未来功能扩展？

---

## 📝 更新日志

- **2024-01-15**: 创建产品规划文档
- **2024-01-15**: 完善积分系统和AI助手设计
- **2024-01-15**: 添加数据库设计和技术架构

---

*此文档将根据讨论结果和开发进展持续更新*
