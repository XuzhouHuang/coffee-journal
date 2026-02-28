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
| 数据库 | Azure SQL (Serverless) 或 PostgreSQL Flexible Server | 云原生，按需计费 |
| 存储 | Azure Blob Storage | 图片/照片存储 |
| 部署 | Azure Container Apps | 按需缩放，闲时近零成本 |
| CI/CD | GitHub Actions → Azure | 推代码自动部署 |

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
| roasterId | Int? (FK) | 烘焙商（可选） |
| regionId | Int? (FK) | 产区（可选） |
| varietyId | Int? (FK) | 品种（可选） |
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
| source | String? | 购买渠道（淘宝/官网/线下） |
| notes | String? | 备注 |

### BrewLog 冲煮记录
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| beanId | Int (FK) | 咖啡豆 |
| brewMethod | String | 冲煮方式（手冲/摩卡壶/法压等） |
| dose | Float? | 粉量(g) |
| waterAmount | Float? | 水量(ml) |
| ratio | String? | 粉水比 |
| grindSize | String? | 研磨度 |
| waterTemp | Int? | 水温 |
| brewTime | String? | 冲煮时间 |
| rating | Float? | 评分(1-5) |
| notes | String? | 品鉴笔记 |
| brewDate | DateTime | 冲煮日期 |

### CafePurchase 咖啡店消费
| 字段 | 类型 | 说明 |
|---|---|---|
| id | Int (PK) | 主键 |
| cafeName | String | 店名 |
| location | String? | 城市/地址 |
| drinkName | String | 饮品名 |
| drinkType | String? | 饮品类型（手冲/拿铁/美式/冷萃等） |
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
├── 豆子详情
├── 购买记录
└── 冲煮记录（每次冲煮的参数和品鉴）

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
| Phase 1 | 项目初始化 + 数据模型 + Prisma schema | 1天 |
| Phase 2 | 咖啡豆 CRUD + 购买记录 + 冲煮记录（核心高频功能） | 2-3天 |
| Phase 3 | 咖啡店消费记录 + 消费统计 | 1-2天 |
| Phase 4 | 知识库页面（产区/品种/烘焙商）+ 种子数据 | 2天 |
| Phase 5 | Dashboard 首页 + 统计图表 | 2天 |
| Phase 6 | 搜索 + 筛选 + UI 美化 | 1-2天 |
| **Phase 7** | **🤖 AI 拍照识别咖啡袋自动录入** | **2-3天** |

> **调整说明：**
> - 先做高频功能（记录豆子/冲煮/消费），再做低频功能（知识库）
> - 购买记录和冲煮记录拆开，一袋豆子可以记多次冲煮
> - Dashboard 放到最后，因为它依赖前面所有数据
> - 知识库加入种子数据（常见产区、品种预填），避免空页面

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

## Azure 部署方案

### 架构图

```
GitHub (Push) → GitHub Actions (CI/CD)
                     ↓
            Azure Container Apps ← Azure Container Registry
                     ↓
              Next.js App (前端+API)
                     ↓
         ┌──────────┼──────────┐
         ↓          ↓          ↓
  Azure Database   Blob      OpenRouter
  for PostgreSQL  Storage     (AI识别)
  (Flexible)     (照片)
```

### 各组件选型 & 月成本估算（个人使用）

| 组件 | Azure 服务 | 规格 | 月估算费用 |
|---|---|---|---|
| 应用托管 | **Container Apps** | Consumption Plan，按需缩放 | ~$0-5（低流量几乎免费） |
| 数据库 | **PostgreSQL Flexible Server** | Burstable B1ms (1vCPU, 2GB) | ~$12-15 |
| 图片存储 | **Blob Storage** | Hot tier, <1GB | ~$0.02 |
| 容器镜像 | **Container Registry** | Basic | ~$5 |
| 域名/HTTPS | **Container Apps 自带** | 免费 HTTPS 证书 | $0 |
| **总计** | | | **~$17-25/月** |

### 更省钱的替代方案

| 组件 | 省钱方案 | 月估算费用 |
|---|---|---|
| 应用托管 | **Azure App Service** Free/B1 | $0-13 |
| 数据库 | **SQLite + 持久化 Volume** | $0（嵌入App内） |
| **总计** | | **~$0-13/月** |

> 💡 如果不需要高并发，SQLite + App Service 最省钱。
> PostgreSQL 方案更专业，适合后续扩展。

### 部署配置

#### Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

#### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy to Azure
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - run: |
          az acr build --registry $ACR_NAME --image coffee-journal:${{ github.sha }} .
          az containerapp update --name coffee-journal --resource-group $RG \
            --image $ACR_NAME.azurecr.io/coffee-journal:${{ github.sha }}
```

### 环境变量
```env
DATABASE_URL=postgresql://user:pass@xxx.postgres.database.azure.com:5432/coffeejournal
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
OPENROUTER_API_KEY=sk-or-...  # Phase 6 AI拍照识别用
```

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
