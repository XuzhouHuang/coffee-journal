import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { HeroIcons } from "@/components/hero-icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [beanCount, brewCount, monthBeanSpend, monthCafeSpend, monthEquipmentSpend, monthBreadSpend, topRating, inStockBeans, recentBeanPurchases, recentCafePurchases, recentEquipmentPurchases, recentBreadPurchases] = await Promise.all([
    prisma.bean.count(),
    prisma.brewLog.count(),
    prisma.beanPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.cafePurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.equipmentPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.breadPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.brewLog.aggregate({ _max: { rating: true } }),
    prisma.bean.findMany({
      where: { status: "在库" },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, origin: true, species: true, process: true, roastLevel: true },
    }),
    prisma.beanPurchase.findMany({
      take: 5,
      orderBy: { purchaseDate: "desc" },
      include: { bean: { select: { name: true } } },
    }),
    prisma.cafePurchase.findMany({
      take: 5,
      orderBy: { purchaseDate: "desc" },
    }),
    prisma.equipmentPurchase.findMany({
      take: 5,
      orderBy: { purchaseDate: "desc" },
    }),
    prisma.breadPurchase.findMany({
      take: 5,
      orderBy: { purchaseDate: "desc" },
    }),
  ]);

  const monthTotal = (monthBeanSpend._sum.price || 0) + (monthCafeSpend._sum.price || 0) + (monthEquipmentSpend._sum.price || 0) + (monthBreadSpend._sum.price || 0);
  const maxRating = topRating._max.rating;

  const recentPurchases = [
    ...recentBeanPurchases.map((p: any) => ({
      id: `b-${p.id}`,
      name: p.bean.name,
      price: p.price,
      date: p.purchaseDate,
      type: "豆子" as const,
    })),
    ...recentCafePurchases.map((p: any) => ({
      id: `c-${p.id}`,
      name: `${p.cafeName} · ${p.drinkName}`,
      price: p.price,
      date: p.purchaseDate,
      type: "咖啡店" as const,
    })),
    ...recentEquipmentPurchases.map((p: any) => ({
      id: `e-${p.id}`,
      name: p.name,
      price: p.price,
      date: p.purchaseDate,
      type: "器具" as const,
    })),
    ...recentBreadPurchases.map((p: any) => ({
      id: `br-${p.id}`,
      name: `${p.bakeryName} · ${p.breadName}`,
      price: p.price,
      date: p.purchaseDate,
      type: "面包" as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statCards = [
    { emoji: "☕", label: "咖啡豆种类", value: `${beanCount} 款` },
    { emoji: "📝", label: "冲煮记录", value: `${brewCount} 次` },
    { emoji: "💰", label: "本月消费", value: `¥${monthTotal.toFixed(0)}` },
    { emoji: "⭐", label: "最高评分", value: maxRating != null ? maxRating.toFixed(1) : "-" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="pt-8 pb-2 animate-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gradient-warm font-[family-name:var(--font-brand)] tracking-tight leading-[1.1]"
                style={{ fontSize: 'var(--font-display)' }}>
              咖啡，面包，好天气
            </h1>
            <p className="text-[#9C9490] mt-3 text-sm tracking-wide">记录每一天的好味道</p>
          </div>
          <HeroIcons />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <div key={s.label} className={`glass-card p-5 animate-in-up delay-${i + 1}`}>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[rgba(200,168,130,0.08)] flex items-center justify-center text-lg shrink-0">
                {s.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-[#B8B0A8] mb-1 truncate">{s.label}</p>
                <p className="text-2xl font-bold text-[#8B7355] tracking-tight leading-none">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* In-stock beans */}
        <Card className="glass-card border-0 animate-in-up delay-2 overflow-hidden">
          <CardHeader className="pb-1 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">在仓咖啡豆</CardTitle>
              <Link href="/beans" className="text-[11px] text-[#B8B0A8] hover:text-[#8B7355] transition-colors shrink-0">
                查看全部 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            {inStockBeans.length === 0 ? (
              <p className="text-[#B8B0A8] text-sm py-6 text-center">目前没有在仓咖啡豆</p>
            ) : (
              <div className="space-y-0.5 mt-2">
                {inStockBeans.map((b) => (
                  <Link key={b.id} href={`/beans/${b.id}`} className="flex items-center justify-between text-sm px-2 sm:px-3 py-3 rounded-lg hover:bg-[rgba(200,168,130,0.04)] transition-colors gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-[#2C2825] truncate">{b.origin || b.name}</span>
                      {b.species && <span className="text-[#B8B0A8] text-xs hidden sm:inline">{b.species}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#B8B0A8] shrink-0">
                      {b.process && <span className="hidden sm:inline">{b.process}</span>}
                      {b.roastLevel && <span className="text-[#9C9490]">{b.roastLevel}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent purchases */}
        <Card className="glass-card border-0 animate-in-up delay-3 overflow-hidden">
          <CardHeader className="pb-1 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">最近消费</CardTitle>
              <Link href="/purchases" className="text-[11px] text-[#B8B0A8] hover:text-[#8B7355] transition-colors shrink-0">
                查看全部 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            {recentPurchases.length === 0 ? (
              <p className="text-[#B8B0A8] text-sm py-6 text-center">暂无消费记录</p>
            ) : (
              <div className="space-y-0.5 mt-2">
                {recentPurchases.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-sm px-2 sm:px-3 py-3 rounded-lg hover:bg-[rgba(200,168,130,0.04)] transition-colors gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-medium text-[#2C2825] truncate">{p.name}</span>
                      <span className="text-[10px] text-[#9C9490] bg-[#F5F0EB] px-1.5 py-0.5 rounded shrink-0">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs text-[#B8B0A8] shrink-0">
                      <span className="text-[#8B7355] font-medium">¥{p.price}</span>
                      <span className="hidden sm:inline">{new Date(p.date).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
