# ☕ Coffee Journal

个人咖啡知识库 + 消费记录追踪器

**Live:** https://coffee.kikihuang.net

---

## 核心功能

- **咖啡豆管理** — 产区、品种、烘焙商、处理法、评分
- **冲煮记录** — 参数追踪（粉量/水量/水温/研磨度）+ 品鉴笔记
- **消费记录** — 咖啡豆购买 + 咖啡店消费，月度统计图表
- **知识库** — 产区百科、品种图鉴、烘焙商目录、处理法参考
- **Dashboard** — 统计卡片 + 最近记录

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 + TypeScript |
| UI | TailwindCSS + shadcn/ui |
| 字体 | DM Serif Display + Noto Serif SC（北欧杂志风） |
| 图表 | Recharts |
| ORM | Prisma（@prisma/adapter-mssql） |
| 数据库 | Azure SQL Database（Basic 层） |
| 部署 | Azure Container Apps |
| 认证 | Azure Easy Auth (Entra ID) + MI Bearer Token |

---

## 架构

```
                    用户浏览器
                        │
                        ▼ HTTPS
               ┌────────────────┐
               │  Azure DNS     │
               │  coffee.       │
               │  kikihuang.net │
               └───────┬────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────┐
│  VNet: coffee-vnet (10.0.0.0/16)                  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  Subnet: capp-subnet (10.0.2.0/23)          │  │
│  │                                             │  │
│  │  Container App: coffee-journal-v2           │  │
│  │  ┌───────────────────────────────────┐      │  │
│  │  │  Next.js App (0.25 vCPU, 0.5Gi)  │      │  │
│  │  │  - Easy Auth (AAD browser login)  │      │  │
│  │  │  - MI Bearer (bot API access)     │      │  │
│  │  │  - Password cookie (fallback)     │      │  │
│  │  └───────────────┬───────────────────┘      │  │
│  └──────────────────┼──────────────────────────┘  │
│                     │ 内网                         │
│  ┌──────────────────┼──────────────────────────┐  │
│  │  Subnet: sql-pe-subnet (10.0.1.0/24)       │  │
│  │                  ▼                          │  │
│  │  Private Endpoint (10.0.1.4:1433)           │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                             │
│  Private DNS Zone:                                │
│  coffeejournalsql.privatelink.database.           │
│  windows.net → 10.0.1.4                           │
└─────────────────────┬─────────────────────────────┘
                      │
                      ▼
            ┌───────────────────┐
            │  Azure SQL Server │
            │  coffeejournalsql │
            │  (Entra-only)     │
            │                   │
            │  DB: coffee-      │
            │  journal-db       │
            │  (Basic, 5 DTU)   │
            │                   │
            │  公网访问: ❌ 关闭  │
            └───────────────────┘
```

### 网络安全

- **SQL Server 公网访问已关闭** — 所有流量通过 VNet 内的 Private Endpoint
- **Entra-only 认证** — 无 SQL 密码，仅 Managed Identity
- **Easy Auth** — 浏览器登录走 Azure AD，匿名可读、写操作需认证
- **MI Bearer Token** — 机器人通过 Managed Identity 获取 JWT 访问 API

### 认证流程

```
浏览器用户:  /.auth/login/aad → AAD 登录 → x-ms-client-principal header
Bot (MI):    IMDS → JWT token → Authorization: Bearer → middleware 验证
密码登录:    POST /api/auth/login → httpOnly cookie → middleware 验证
读操作:      无需认证（AllowAnonymous）
```

---

## 数据模型

7 个 Prisma 模型，SQL Server provider：

| 模型 | 说明 | 关键字段 |
|---|---|---|
| Region | 产区 | country, region, subRegion, altitude |
| Variety | 品种 | name, description, flavor |
| Roaster | 烘焙商 | name, country, specialty, website |
| Bean | 咖啡豆 | name, roastLevel, process, score, FK→Roaster/Region/Variety |
| BeanPurchase | 豆子购买 | price, weight, source, FK→Bean |
| BrewLog | 冲煮记录 | brewMethod, dose, waterAmount, ratio, rating, FK→Bean |
| CafePurchase | 咖啡店消费 | cafeName, drinkName, price, rating |

---

## Azure 资源清单

| 资源 | 名称 | 规格 | 月费用 |
|---|---|---|---|
| Resource Group | `coffee-journal-rg` | East Asia | - |
| Container Registry | `coffeejournalacr` | Basic | ~$5 |
| Container App Env | `coffee-journal-env-v2` | Consumption + VNet | ~$0 |
| Container App | `coffee-journal-v2` | 0.25 vCPU, 0.5Gi, 1 replica | ~$5 |
| SQL Server | `coffeejournalsql` | Entra-only, 公网关闭 | - |
| SQL Database | `coffee-journal-db` | Basic (5 DTU, 2GB) | ~$5 |
| VNet | `coffee-vnet` | 10.0.0.0/16 | $0 |
| Private Endpoint | `sql-private-endpoint` | sqlServer | ~$1 |
| Private DNS Zone | `privatelink.database.windows.net` | A record → 10.0.1.4 | ~$0.5 |
| Managed Identity | `coffee-journal-mi` | User-assigned | $0 |
| **总计** | | | **~¥120/月** |

---

## 本地开发

```bash
# 克隆
git clone https://github.com/XuzhouHuang/coffee-journal.git
cd coffee-journal

# 安装依赖
npm install

# 配置环境变量（本地用 SQLite）
echo 'DATABASE_URL="file:./dev.db"' > .env.local

# 注意：本地开发需将 prisma/schema.prisma 的 provider 临时改为 "sqlite"
# 并移除 @db.NVarChar 注解

# 初始化数据库
npx prisma migrate dev
npx prisma db seed

# 启动（端口 3001，如 3000 被占用）
npm run dev -- -p 3001
```

---

## 部署

```bash
# ACR 云端构建
az acr build --registry coffeejournalacr \
  --image coffee-journal:latest \
  --file Dockerfile .

# 更新 Container App
az containerapp update \
  --resource-group coffee-journal-rg \
  --name coffee-journal-v2 \
  --image coffeejournalacr.azurecr.io/coffee-journal:latest
```

---

## 开发路线

- [x] Phase 1: 项目初始化 + Prisma schema + 数据模型
- [x] Phase 2: 咖啡豆 CRUD + 购买记录 + 冲煮记录
- [x] Phase 3: 咖啡店消费 + 月度统计图表
- [x] Phase 4: 知识库（产区/品种/烘焙商/处理法）
- [x] Phase 5: Dashboard 首页
- [ ] Phase 6: 搜索 + 筛选 + UI 美化
- [ ] Phase 7: 🤖 AI 拍照识别咖啡袋自动录入

---

## 设计风格

**Design C — 北欧杂志风**

- 暖色调编辑排版（#FAF8F5 背景，#2C2825 文字）
- 全衬线字体：DM Serif Display（英文）+ Noto Serif SC / 思源宋体（中文）
- 极简侧边栏导航，editorial spacing
- 灵感：Kinfolk Magazine 美学
