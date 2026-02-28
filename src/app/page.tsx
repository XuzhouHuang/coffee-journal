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
    <div className="space-y-6">
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent font-[family-name:var(--font-brand)]">
          Coffee Journal ☕
        </h1>
        <p className="text-slate-400">记录每一杯的味道</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass-card border-0">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-lg`}>
                  {s.emoji}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-blue-400">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent brews */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-base">最近冲煮</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBrews.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无冲煮记录</p>
            ) : (
              <div className="space-y-3">
                {recentBrews.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="font-medium">{b.bean.name}</span>
                      <span className="text-muted-foreground ml-2">{b.brewMethod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {b.rating != null && <span>⭐ {b.rating}</span>}
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
          <CardHeader>
            <CardTitle className="text-base">最近消费</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPurchases.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无消费记录</p>
            ) : (
              <div className="space-y-3">
                {recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>¥{p.price}</span>
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
