# ☕🍞🌤️ 面包咖啡好天气

个人咖啡 & 面包知识库 + 消费记录 + 每日咖啡新闻

<sub>✨ Vibe coded with <a href="https://github.com/openclaw/openclaw">OpenClaw</a></sub>

---

## 核心功能

- **☕ 咖啡豆管理** — 产区、品种、烘焙商、处理法、评分、库存状态追踪
- **📝 冲煮记录** — 参数追踪（粉量/水量/水温/研磨度）+ 品鉴笔记
- **🍞 面包记录** — 购买记录 + 食谱管理（结构化配料表 + 步骤 + 补充知识）
- **💰 消费记录** — 豆子 + 咖啡店 + 器具 + 面包，月度统计图表
- **📚 知识库** — 产区百科（按国家分组）、品种图鉴、烘焙商目录、处理法参考、面包食谱
- **📰 咖啡日报** — 每日自动抓取 4 大咖啡网站新闻，AI 翻译成中文，首页展示

---

## 咖啡日报 ☕📰

每天北京时间 08:30 自动从 4 个咖啡媒体抓取最新文章并翻译：

| 来源 | 类型 | 抓取方式 |
|------|------|---------|
| [Perfect Daily Grind](https://perfectdailygrind.com) | 精品咖啡深度报道 | RSS + web fetch |
| [Daily Coffee News](https://dailycoffeenews.com) | 产业新闻 | Tavily API（Cloudflare 保护） |
| [Sprudge](https://sprudge.com) | 咖啡文化 + 新闻 | RSS + web fetch |
| [Coffee Review](https://coffeereview.com) | 专业评测 | RSS + web fetch |

- 首页按日期分组显示：**今日咖啡** + **昨日咖啡**
- 点击标题进入详情页查看全文中文翻译 + 原文链接
- 自动清理 2 天前的历史新闻
- 翻译风格：流畅中文 + 保留英文专有名词

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 + TypeScript |
| UI | TailwindCSS + shadcn/ui |
| 字体 | DM Serif Display + Noto Serif SC（北欧杂志风） |
| 图表 | Recharts |
| ORM | Prisma（SQLite 本地开发 / SQL Server 生产） |
| 数据库 | Azure SQL Database (Basic, Entra-only) |
| 部署 | Azure Container Apps |
| 认证 | Azure Easy Auth (Entra ID) + Managed Identity |
| 新闻抓取 | RSS + web fetch + Tavily API |
| 自动化 | OpenClaw Cron（每日定时任务） |

---

## 架构概览

```
用户 → HTTPS → coffee.kikihuang.net
                    │
              Easy Auth (AAD)
                    │
         Azure Container Apps
          (0.25 vCPU / 0.5Gi)
                    │
              VNet (10.0.0.0/16)
                    │
           Private Endpoint (10.0.1.4)
                    │
         Azure SQL Database (Basic)
          Entra-only, 公网关闭
```

- **VNet + Private Endpoint** — SQL 仅内网可达，公网完全关闭
- **Entra-only 认证** — 无 SQL 密码，仅 Managed Identity Token
- **Easy Auth** — 匿名可读，写操作需 AAD 登录或 MI Bearer Token
- **自定义域名** — `coffee.kikihuang.net`，托管证书

---

## 数据模型

12 个 Prisma 模型：

| 模型 | 说明 |
|---|---|
| Region | 产区（国家/地区/海拔/气候） |
| Variety | 品种 |
| Roaster | 烘焙商 |
| Bean | 咖啡豆（产地、品种、处理法、库存状态） |
| BeanPurchase | 豆子购买记录 |
| BrewLog | 冲煮记录 |
| ProcessingMethod | 处理法 |
| EquipmentPurchase | 器具购买记录 |
| CafePurchase | 咖啡店消费 |
| BreadPurchase | 面包购买记录 |
| BreadRecipe | 面包食谱（JSON 配料表 + 步骤 + 补充知识） |
| **CoffeeNews** | **咖啡新闻（标题/翻译/来源/全文翻译/日期）** |

---

## 页面结构

```
/                       首页（咖啡日报：今日 + 昨日）
/beans                  咖啡豆列表（统计卡片 + 筛选）
/beans/[id]             咖啡豆详情
/purchases              消费记录（豆子/咖啡店/器具/面包）
/purchases/stats        月度统计图表
/bread/recipes          面包食谱列表
/bread/recipes/[id]     食谱详情（配料表 + 步骤 + 知识卡片）
/news/[id]              新闻详情（全文中文翻译 + 原文链接）
/knowledge/regions      产区百科（按国家分组 + 国旗）
/knowledge/regions/[c]  国家详情页
/knowledge/varieties    品种图鉴
/knowledge/roasters     烘焙商目录
/knowledge/processing   处理法参考
```

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

# 启动（端口 3001 避免冲突）
npm run dev -- -p 3001
```

---

## 部署

使用 Azure Container Apps + ACR + Azure SQL：

```bash
# ACR 构建
az acr build --registry coffeejournalacr \
  --image coffee-journal:latest \
  --file Dockerfile .

# 更新 Container App
az containerapp update \
  --resource-group coffee-journal-rg \
  --name coffee-journal-v2 \
  --image coffeejournalacr.azurecr.io/coffee-journal:latest \
  --revision-suffix <revision-name>
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `AZURE_SQL_SERVER` | SQL Server 地址 |
| `AZURE_SQL_DATABASE` | 数据库名 |
| `AZURE_CLIENT_ID` | Managed Identity Client ID |
| `AUTH_TENANT_ID` | Azure AD Tenant ID |
| `AUTH_CLIENT_ID` | App Registration Client ID |
| `ALLOWED_APP_IDS` | 允许的 MI 应用 ID（逗号分隔） |

### Azure 资源

| 资源 | 名称 |
|------|------|
| Resource Group | `coffee-journal-rg` |
| Container Registry | `coffeejournalacr` (Basic, East Asia) |
| Container App | `coffee-journal-v2` (0.25 vCPU, 0.5Gi) |
| SQL Server | `coffeejournalsql.database.windows.net` |
| SQL Database | `coffee-journal-db` (Basic, 2GB) |
| Managed Identity | `coffee-journal-mi` |
| VNet | `coffee-vnet` (10.0.0.0/16) |
| Custom Domain | `coffee.kikihuang.net` |

---

## 设计风格

**北欧杂志风 (Nordic Editorial)**

- 暖白色调（#FAF8F5 背景，#2C2825 文字，#8B7355 咖啡色强调）
- 全衬线字体：DM Serif Display（英文）+ Noto Serif SC / 思源宋体（中文）
- 极简侧边栏导航，editorial spacing
- 响应式适配：手机端 hamburger 菜单 + 紧凑布局
- 灵感：Kinfolk Magazine 美学

---

## API 路由

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/api/beans` | 咖啡豆列表 |
| POST | `/api/beans` | 创建咖啡豆 |
| GET | `/api/beans/[id]` | 咖啡豆详情 |
| GET/POST | `/api/bean-purchases` | 豆子购买记录 |
| GET/POST | `/api/brew-logs` | 冲煮记录 |
| GET/POST | `/api/cafe-purchases` | 咖啡店消费 |
| GET/POST | `/api/bread/purchases` | 面包购买记录 |
| GET/POST/PUT | `/api/bread/recipes` | 面包食谱 |
| GET/POST/PUT/DELETE | `/api/news` | 咖啡新闻（含批量创建、旧闻清理） |
| GET/POST | `/api/regions` | 产区 |
| GET/POST | `/api/varieties` | 品种 |
| GET/POST | `/api/roasters` | 烘焙商 |

---

## 开发路线

- [x] Phase 1: 项目初始化 + 数据模型
- [x] Phase 2: 咖啡豆 CRUD + 购买记录 + 冲煮记录
- [x] Phase 3: 咖啡店消费 + 月度统计图表
- [x] Phase 4: 知识库（产区/品种/烘焙商/处理法）
- [x] Phase 5: Dashboard 首页
- [x] Phase 6: 面包购买 + 食谱管理
- [x] Phase 7: UI 优化 + 手机端适配
- [x] Phase 8: 咖啡日报（4 源抓取 + AI 翻译 + 每日定时更新）
- [ ] Phase 9: 🤖 AI 拍照识别咖啡袋自动录入

---

## License

Private project.
