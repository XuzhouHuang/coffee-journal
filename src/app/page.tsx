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

  // Merge and sort recent purchases
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">咖啡日志 ☕</h1>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">☕ 咖啡豆种类</p>
            <p className="text-2xl font-bold">{beanCount} 款</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">📝 冲煮记录</p>
            <p className="text-2xl font-bold">{brewCount} 次</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">💰 本月消费</p>
            <p className="text-2xl font-bold">¥{monthTotal.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">⭐ 最高评分</p>
            <p className="text-2xl font-bold">{maxRating != null ? maxRating.toFixed(1) : "-"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent brews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近冲煮</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBrews.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无冲煮记录</p>
            ) : (
              <div className="space-y-3">
                {recentBrews.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近消费</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPurchases.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无消费记录</p>
            ) : (
              <div className="space-y-3">
                {recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
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
