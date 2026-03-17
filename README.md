# ☕🍞🌤️ 面包咖啡好天气

个人咖啡 & 面包知识库 + 消费记录追踪器

<sub>✨ Vibe coded with <a href="https://github.com/openclaw/openclaw">OpenClaw</a></sub>

---

## 核心功能

- **咖啡豆管理** — 产区、品种、烘焙商、处理法、评分、库存状态
- **冲煮记录** — 参数追踪（粉量/水量/水温/研磨度）+ 品鉴笔记
- **面包记录** — 购买记录 + 食谱管理（结构化配方 + 步骤）
- **消费记录** — 豆子购买 + 咖啡店 + 器具 + 面包，月度统计图表
- **知识库** — 产区百科、品种图鉴、烘焙商目录、处理法参考、面包食谱
- **Dashboard** — 在仓咖啡豆 + 最近消费 + 月度统计

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 + TypeScript |
| UI | TailwindCSS + shadcn/ui |
| 字体 | DM Serif Display + Noto Serif SC（北欧杂志风） |
| 图表 | Recharts |
| ORM | Prisma（支持 SQLite 本地开发 / SQL Server 生产） |
| 数据库 | Azure SQL Database |
| 部署 | Azure Container Apps |
| 认证 | Azure Easy Auth (Entra ID) + Managed Identity |

---

## 架构概览

```
用户 → HTTPS → Azure Container Apps → VNet → Private Endpoint → Azure SQL
                    │
              Easy Auth (AAD)
              MI Bearer Token
```

- **VNet + Private Endpoint** — SQL 仅内网可达，公网关闭
- **Entra-only 认证** — 无 SQL 密码，仅 Managed Identity
- **Easy Auth** — 浏览器走 AAD 登录，匿名可读、写操作需认证

---

## 数据模型

9 个 Prisma 模型：

| 模型 | 说明 |
|---|---|
| Region | 产区（国家/地区/海拔） |
| Variety | 品种 |
| Roaster | 烘焙商 |
| Bean | 咖啡豆（含产地、品种、处理法、库存状态） |
| BeanPurchase | 豆子购买记录 |
| BrewLog | 冲煮记录 |
| CafePurchase | 咖啡店消费 |
| BreadPurchase | 面包购买记录 |
| BreadRecipe | 面包食谱（结构化配料 + 步骤） |

---

## 本地开发

```bash
# 克隆
git clone https://github.com/XuzhouHuang/coffee-journal.git
cd coffee-journal

# 安装依赖
npm install

# 注意：本地开发需将 prisma/schema.prisma 的 provider 改为 "sqlite"
# 并移除 @db.NVarChar / @db.NVarChar(Max) 注解

# 配置环境变量
echo 'DATABASE_URL="file:./dev.db"' > .env.local

# 初始化数据库
npx prisma migrate dev
npx prisma db seed

# 启动
npm run dev
```

---

## 部署

使用 Azure Container Apps + ACR + Azure SQL：

```bash
# ACR 构建
az acr build --registry <your-acr> \
  --image coffee-journal:latest \
  --file Dockerfile .

# 更新 Container App
az containerapp update \
  --resource-group <your-rg> \
  --name <your-app> \
  --image <your-acr>.azurecr.io/coffee-journal:latest
```

需要配置的环境变量：
- `AZURE_SQL_SERVER` — SQL Server 地址
- `AZURE_SQL_DATABASE` — 数据库名
- `AZURE_CLIENT_ID` — Managed Identity Client ID
- `AUTH_TENANT_ID` — Azure AD Tenant ID
- `AUTH_CLIENT_ID` — App Registration Client ID
- `ALLOWED_APP_IDS` — 允许的 MI 应用 ID（逗号分隔）

---

## 设计风格

**北欧杂志风 (Nordic Editorial)**

- 暖色调编辑排版（#FAF8F5 背景，#2C2825 文字）
- 全衬线字体：DM Serif Display（英文）+ Noto Serif SC / 思源宋体（中文）
- 极简侧边栏导航，editorial spacing
- 灵感：Kinfolk Magazine 美学

---

## 开发路线

- [x] Phase 1: 项目初始化 + 数据模型
- [x] Phase 2: 咖啡豆 CRUD + 购买记录 + 冲煮记录
- [x] Phase 3: 咖啡店消费 + 月度统计图表
- [x] Phase 4: 知识库
- [x] Phase 5: Dashboard 首页
- [x] Phase 6: 面包购买 + 食谱管理
- [x] Phase 7: UI 优化 + 手机端适配
- [ ] Phase 8: 🤖 AI 拍照识别咖啡袋自动录入
