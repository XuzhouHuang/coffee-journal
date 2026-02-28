import { prisma } from "@/lib/db";
import { PurchasesList } from "@/components/purchases-list";

export default async function PurchasesPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [beanPurchasesRaw, cafePurchasesRaw, monthBeanAgg, monthCafeAgg, monthBeanCount, monthCafeCount] = await Promise.all([
    prisma.beanPurchase.findMany({
      include: { bean: true },
      orderBy: { purchaseDate: "desc" },
      take: 20,
    }),
    prisma.cafePurchase.findMany({
      orderBy: { purchaseDate: "desc" },
      take: 20,
    }),
    prisma.beanPurchase.aggregate({
      _sum: { price: true },
      where: { purchaseDate: { gte: startOfMonth } },
    }),
    prisma.cafePurchase.aggregate({
      _sum: { price: true },
      where: { purchaseDate: { gte: startOfMonth } },
    }),
    prisma.beanPurchase.count({ where: { purchaseDate: { gte: startOfMonth } } }),
    prisma.cafePurchase.count({ where: { purchaseDate: { gte: startOfMonth } } }),
  ]);

  // Monthly chart data: last 6 months via DB aggregation
  const monthlyData: { month: string; beans: number; cafe: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const [beanMonth, cafeMonth] = await Promise.all([
      prisma.beanPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: start, lt: end } } }),
      prisma.cafePurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: start, lt: end } } }),
    ]);
    monthlyData.push({
      month: `${start.getMonth() + 1}月`,
      beans: beanMonth._sum.price || 0,
      cafe: cafeMonth._sum.price || 0,
    });
  }

  const beanPurchases = beanPurchasesRaw.map((p) => ({
    id: p.id,
    price: p.price,
    weight: p.weight,
    purchaseDate: p.purchaseDate.toISOString(),
    source: p.source,
    notes: p.notes,
    bean: { id: p.bean.id, name: p.bean.name },
  }));

  const cafePurchases = cafePurchasesRaw.map((p) => ({
    id: p.id,
    cafeName: p.cafeName,
    location: p.location,
    drinkName: p.drinkName,
    drinkType: p.drinkType,
    price: p.price,
    purchaseDate: p.purchaseDate.toISOString(),
    rating: p.rating,
  }));

  const stats = {
    monthBeans: monthBeanAgg._sum.price || 0,
    monthCafe: monthCafeAgg._sum.price || 0,
    monthTotal: (monthBeanAgg._sum.price || 0) + (monthCafeAgg._sum.price || 0),
    monthCount: monthBeanCount + monthCafeCount,
    monthlyData,
  };

  return (
    <PurchasesList
      initialBeanPurchases={beanPurchases}
      initialCafePurchases={cafePurchases}
      stats={stats}
    />
  );
}
