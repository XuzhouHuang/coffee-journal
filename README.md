# Coffee Journal App — 架构设计文档

## 项目概述

个人咖啡知识库 + 消费记录追踪器，浏览器访问，数据本地化。

### 核心功能
1. **咖啡豆知识库** — 产区、地块、品种百科
2. **烘焙商管理** — 国内外烘焙商信息、特色、购买渠道
3. **咖啡豆购买记录** — 价格/品种/冲煮方法/品鉴笔记
4. **咖啡店消费记录** — 追踪咖啡店消费，年度花费回顾

---

## 技术栈

| 层 | 技术 | 理由 |
|---|---|---|
| 框架 | Next.js 15 | 全栈一体，部署简单 |
| 语言 | TypeScript | 类型安全 |
| UI | TailwindCSS + shadcn/ui | 快速出好看的界面 |
| 图表 | Recharts | React 图表库，统计页面用 |
| 数据库 | SQLite + Prisma | 零配置，轻量 |
| 部署 | Vercel 或本地 | 免费，一键部署 |

---

## 数据模型

### Region 产区
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| country | String | 国家 |
| region | String | 产区 |
| subRegion | String? | 地块 |
| altitude | String? | 海拔 |
| climate | String? | 气候 |
| notes | String? | 备注 |

### Variety 品种
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| name | String | 品种名 |
| description | String? | 描述 |
| flavor | String? | 风味特征 |

### Roaster 烘焙商
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| name | String | 名称 |
| country | String | 所在国 |
| specialty | String? | 特色 |
| website | String? | 官网 |
| shopUrl | String? | 购买链接 |
| notes | String? | 备注 |

### Bean 咖啡豆
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| name | String | 豆名 |
| roasterId | Int (FK) | 烘焙商 |
| regionId | Int (FK) | 产区 |
| varietyId | Int (FK) | 品种 |
| process | String? | 处理法 |
| roastLevel | String? | 烘焙度 |
| flavorNotes | String? | 风味描述 |
| score | Float? | 评分 |

### BeanPurchase 豆子购买记录
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| beanId | Int (FK) | 咖啡豆 |
| price | Float | 价格 |
| weight | Int | 重量(g) |
| purchaseDate | DateTime | 购买日期 |
| brewMethod | String? | 冲煮方式 |
| ratio | String? | 粉水比 |
| grindSize | String? | 研磨度 |
| waterTemp | Int? | 水温 |
| rating | Float? | 评分 |
| notes | String? | 品鉴笔记 |

### CafePurchase 咖啡店消费
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| cafeName | String | 店名 |
| drinkName | String | 饮品名 |
| price | Float | 价格 |
| purchaseDate | DateTime | 日期 |
| rating | Float? | 评分 |
| notes | String? | 备注 |
| photo | String? | 照片路径 |

---

## 页面规划

```
/ 首页（Dashboard）
├── 本月咖啡消费总览
├── 最近购买记录
└── 咖啡豆库存概览

/knowledge 知识库
├── /regions     产区浏览（按国家→产区→地块）
├── /varieties   品种百科
└── /roasters    烘焙商列表

/beans 我的咖啡豆
├── 豆子列表 + 筛选
├── 添加新豆子
└── 豆子详情（含冲煮记录）

/purchases 消费记录
├── 豆子购买记录
├── 咖啡店消费记录
└── 年度/月度消费统计图表

/stats 统计分析
├── 年度消费报告（总花费、最爱品种、最常去的店）
├── 冲煮偏好分析
└── 消费趋势图
```

---

## 项目结构

```
coffee-journal/
├── prisma/
│   └── schema.prisma        # 数据模型
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # 首页 Dashboard
│   │   ├── knowledge/        # 知识库页面
│   │   ├── beans/            # 咖啡豆管理
│   │   ├── purchases/        # 消费记录
│   │   └── stats/            # 统计分析
│   ├── components/           # 通用组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── charts/           # 图表组件
│   │   └── forms/            # 表单组件
│   ├── lib/
│   │   ├── db.ts             # Prisma 客户端
│   │   └── utils.ts          # 工具函数
│   └── types/                # TypeScript 类型
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 开发计划

| 阶段 | 内容 | 预估时间 |
|---|---|---|
| Phase 1 | 数据模型 + 基础 CRUD | 2-3天 |
| Phase 2 | 知识库页面（产区/品种/烘焙商） | 2天 |
| Phase 3 | 购买记录 + 咖啡店消费 | 2天 |
| Phase 4 | Dashboard + 统计图表 | 2天 |
| Phase 5 | 美化 + 搜索 + 筛选 | 1-2天 |
| **Phase 6** | **🤖 AI 拍照识别咖啡袋自动录入** | **2-3天** |

### Phase 6 详情：AI 拍照识别

**功能：** 拍摄咖啡豆包装袋照片 → AI 自动识别并填充以下字段：
- 烘焙商名称
- 咖啡豆名称
- 产区 / 地块
- 品种
- 处理法
- 烘焙度
- 风味描述
- 重量 / 价格（如有标注）

**技术方案：**
- 前端：拍照/上传组件
- 后端：调用 OpenRouter API（推荐 Gemini 3 Flash，便宜且支持图片）
- 流程：上传图片 → LLM 识别 → 返回结构化 JSON → 预填表单 → 用户确认/修改 → 保存

**参考：** Brewlog (https://github.com/jnsgruk/brewlog) 的 bag scanning 实现

**优先级：** 下一次迭代加入（Phase 1-5 完成后）

---

## GitHub 开源项目对比

### 1. ⭐ Beanconqueror（698 stars）— 最成熟
- 🔗 https://github.com/graphefruit/Beanconqueror
- **技术栈：** Ionic + Angular + TypeScript（移动端 APP）
- **功能：** 咖啡豆管理、冲煮记录、蓝牙秤连接、流量曲线图、烘焙记录、SCA杯测、咖啡因追踪（Apple Health）
- **亮点：**
  - 支持蓝牙秤实时出图（Acaia、Decent、Felicita 等）
  - 自定义冲煮参数工作流
  - 多语言（英德西中土）
  - iOS + Android 双平台
- **适合参考：** 数据模型设计、冲煮参数字段
- **不适合：** 移动端 APP 框架，你要的是 Web 端

### 2. 🦀 Brewlog（4 stars，但质量极高）— 最接近你的需求
- 🔗 https://github.com/jnsgruk/brewlog
- **技术栈：** Rust 单二进制 + SQLite + Web UI + REST API + CLI
- **功能：** 烘焙商、烘焙记录、冲煮日志、咖啡店签到、器具管理
- **亮点：**
  - 🤖 **AI 拍照识别咖啡袋** — 用 LLM 自动填充烘焙商和咖啡信息
  - 咖啡店签到功能（Foursquare 集成）
  - 单二进制部署，自动创建和迁移数据库
  - 用 Claude Code 生成的代码
- **适合参考：** 整体架构、咖啡店消费记录、AI 辅助录入
- **不适合：** Rust 学习曲线高

### 3. Bean Counter（56 stars）
- 🔗 https://github.com/BouncyNudibranch/bean-counter
- **技术栈：** Python Flask + SQLite
- **功能：** 豆子购买、烘焙、冲煮追踪
- **评价：** 比较老（Python 2.7），但数据模型可以参考

---

## 方案对比与优化建议

| 维度 | 我们的方案（Next.js） | Brewlog（Rust） | Beanconqueror（Ionic） |
|---|---|---|---|
| 目标平台 | Web ✅ | Web ✅ | 移动 APP |
| 开发难度 | 中等 | 高（Rust） | 高（移动端） |
| 部署难度 | 简单（Vercel） | 简单（单二进制） | 复杂（App Store） |
| AI 功能 | 可加 | ✅ 拍照识别 | ❌ |
| 蓝牙秤 | ❌ | ❌ | ✅ |
| 咖啡店签到 | ✅ 我们有 | ✅ Foursquare | ❌ |

### 从开源项目学到的优化点

1. **🤖 AI 拍照识别（来自 Brewlog）**
   - 拍咖啡豆包装袋照片 → 自动识别产区、品种、烘焙商
   - 大幅减少手动输入，用 OpenRouter + Gemini 实现

2. **📊 冲煮参数工作流（来自 Beanconqueror）**
   - 让用户自定义参数顺序（先磨豆粗细还是先粉量？）
   - 更贴合个人习惯

3. **🏪 咖啡店签到 + 定位（来自 Brewlog）**
   - 集成 Foursquare/Google Places
   - 自动补全咖啡店信息

4. **💧 水质记录（来自 Beanconqueror）**
   - 记录水的 TDS、矿物质含量
   - 对风味影响大，进阶功能

5. **📦 库存追踪（来自 Beanconqueror）**
   - 自动计算剩余豆量
   - 快用完时提醒补货
