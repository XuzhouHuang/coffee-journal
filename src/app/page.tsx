import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [beanCount, brewCount, monthBeanSpend, monthCafeSpend, topRating, recentBrews, recentBeanPurchases, recentCafePurchases] = await Promise.all([
    prisma.bean.count(),
    prisma.brewLog.count(),
    prisma.beanPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.cafePurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
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
  ]);

  const monthTotal = (monthBeanSpend._sum.price || 0) + (monthCafeSpend._sum.price || 0);
  const maxRating = topRating._max.rating;

  const recentPurchases = [
    ...recentBeanPurchases.map((p) => ({
      id: `b-${p.id}`,
      name: p.bean.name,
      price: p.price,
      date: p.purchaseDate,
      type: "豆子" as const,
    })),
    ...recentCafePurchases.map((p) => ({
      id: `c-${p.id}`,
      name: `${p.cafeName} · ${p.drinkName}`,
      price: p.price,
      date: p.purchaseDate,
      type: "咖啡店" as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statCards = [
    { emoji: "☕", label: "咖啡豆种类", value: `${beanCount} 款`, gradient: "from-blue-500/20 to-blue-600/20" },
    { emoji: "📝", label: "冲煮记录", value: `${brewCount} 次`, gradient: "from-blue-500/20 to-blue-600/20" },
    { emoji: "💰", label: "本月消费", value: `¥${monthTotal.toFixed(0)}`, gradient: "from-blue-500/20 to-blue-600/20" },
    { emoji: "⭐", label: "最高评分", value: maxRating != null ? maxRating.toFixed(1) : "-", gradient: "from-blue-500/20 to-blue-600/20" },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Welcome */}
      <div className="space-y-3 pt-6 pb-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent font-[family-name:var(--font-brand)] tracking-tight">
          Coffee Journal
        </h1>
        <p className="text-lg text-slate-400 tracking-wide">记录每一杯的味道 ☕</p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass-card border-0">
            <CardContent className="pt-6 pb-5 px-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {s.emoji}
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-blue-400 tracking-tight">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent brews */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2 px-8 pt-7">
            <CardTitle className="text-lg">最近冲煮</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-7">
            {recentBrews.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">暂无冲煮记录</p>
            ) : (
              <div className="space-y-1">
                {recentBrews.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm px-4 py-3.5 rounded-xl hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="font-medium text-base">{b.bean.name}</span>
                      <span className="text-muted-foreground ml-3">{b.brewMethod}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      {b.rating != null && <span className="text-blue-400">⭐ {b.rating}</span>}
                      <span>{new Date(b.brewDate).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent purchases */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2 px-8 pt-7">
            <CardTitle className="text-lg">最近消费</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-7">
            {recentPurchases.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">暂无消费记录</p>
            ) : (
              <div className="space-y-1">
                {recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm px-4 py-3.5 rounded-xl hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="font-medium text-base">{p.name}</span>
                      <span className="text-muted-foreground ml-3 text-xs bg-white/[0.08] px-2 py-0.5 rounded-full">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-blue-400 font-medium">¥{p.price}</span>
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
