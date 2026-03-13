import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [beanCount, brewCount, monthBeanSpend, monthCafeSpend, monthEquipmentSpend, topRating, recentBrews, recentBeanPurchases, recentCafePurchases, recentEquipmentPurchases] = await Promise.all([
    prisma.bean.count(),
    prisma.brewLog.count(),
    prisma.beanPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.cafePurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.equipmentPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.brewLog.aggregate({ _max: { rating: true } }),
    prisma.brewLog.findMany({
      take: 5,
      orderBy: { brewDate: "desc" },
      include: { bean: { select: { name: true } } },
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
  ]);

  const monthTotal = (monthBeanSpend._sum.price || 0) + (monthCafeSpend._sum.price || 0) + (monthEquipmentSpend._sum.price || 0);
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9C9490] mb-3">个人咖啡日志</p>
        <h1 className="text-gradient-warm font-[family-name:var(--font-brand)] tracking-tight leading-[1.1]"
            style={{ fontSize: 'var(--font-display)' }}>
          Coffee Journal
        </h1>
        <p className="text-[#9C9490] mt-3 text-sm tracking-wide">记录每一杯的味道</p>
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
        {/* Recent brews */}
        <Card className="glass-card border-0 animate-in-up delay-2">
          <CardHeader className="pb-1 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">最近冲煮</CardTitle>
              <Link href="/beans" className="text-[11px] text-[#B8B0A8] hover:text-[#8B7355] transition-colors">
                查看全部 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            {recentBrews.length === 0 ? (
              <p className="text-[#B8B0A8] text-sm py-6 text-center">暂无冲煮记录</p>
            ) : (
              <div className="space-y-0.5 mt-2">
                {recentBrews.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-[rgba(200,168,130,0.04)] transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-[#2C2825] truncate">{b.bean.name}</span>
                      <span className="text-[#B8B0A8] text-xs shrink-0">{b.brewMethod}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#B8B0A8] shrink-0 ml-3">
                      {b.rating != null && <span className="text-[#8B7355]">⭐ {b.rating}</span>}
                      <span>{new Date(b.brewDate).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent purchases */}
        <Card className="glass-card border-0 animate-in-up delay-3">
          <CardHeader className="pb-1 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">最近消费</CardTitle>
              <Link href="/purchases" className="text-[11px] text-[#B8B0A8] hover:text-[#8B7355] transition-colors">
                查看全部 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            {recentPurchases.length === 0 ? (
              <p className="text-[#B8B0A8] text-sm py-6 text-center">暂无消费记录</p>
            ) : (
              <div className="space-y-0.5 mt-2">
                {recentPurchases.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-sm px-3 py-3 rounded-lg hover:bg-[rgba(200,168,130,0.04)] transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-[#2C2825] truncate">{p.name}</span>
                      <span className="text-[10px] text-[#9C9490] bg-[#F5F0EB] px-1.5 py-0.5 rounded shrink-0">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#B8B0A8] shrink-0 ml-3">
                      <span className="text-[#8B7355] font-medium">¥{p.price}</span>
                      <span>{new Date(p.date).toLocaleDateString("zh-CN")}</span>
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
