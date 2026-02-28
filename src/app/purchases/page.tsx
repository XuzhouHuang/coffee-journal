import { prisma } from "@/lib/db";
import { PurchasesList } from "@/components/purchases-list";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [beanPurchasesRaw, cafePurchasesRaw, monthBeanAgg, monthCafeAgg, monthBeanCount, monthCafeCount, beanPricesRaw, cafePricesRaw] = await Promise.all([
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
    prisma.beanPurchase.findMany({
      where: { purchaseDate: { gte: sixMonthsAgo } },
      select: { price: true, purchaseDate: true },
    }),
    prisma.cafePurchase.findMany({
      where: { purchaseDate: { gte: sixMonthsAgo } },
      select: { price: true, purchaseDate: true },
    }),
  ]);

  function monthKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  const beanByMonth = new Map<string, number>();
  const cafeByMonth = new Map<string, number>();
  for (const p of beanPricesRaw) {
    const k = monthKey(p.purchaseDate);
    beanByMonth.set(k, (beanByMonth.get(k) || 0) + p.price);
  }
  for (const p of cafePricesRaw) {
    const k = monthKey(p.purchaseDate);
    cafeByMonth.set(k, (cafeByMonth.get(k) || 0) + p.price);
  }

  const monthlyData: { month: string; beans: number; cafe: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(d);
    monthlyData.push({
      month: `${d.getMonth() + 1}月`,
      beans: beanByMonth.get(k) || 0,
      cafe: cafeByMonth.get(k) || 0,
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
