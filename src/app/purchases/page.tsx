import { prisma } from "@/lib/db";
import { PurchasesList } from "@/components/purchases-list";

export default async function PurchasesPage() {
  const [beanPurchasesRaw, cafePurchasesRaw, allBeanPrices, allCafePrices] = await Promise.all([
    prisma.beanPurchase.findMany({
      include: { bean: true },
      orderBy: { purchaseDate: "desc" },
      take: 20,
    }),
    prisma.cafePurchase.findMany({
      orderBy: { purchaseDate: "desc" },
      take: 20,
    }),
    prisma.beanPurchase.findMany({
      select: { price: true, purchaseDate: true },
    }),
    prisma.cafePurchase.findMany({
      select: { price: true, purchaseDate: true },
    }),
  ]);

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

  // Calculate monthly stats for last 6 months
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyData: { month: string; beans: number; cafe: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = `${m + 1}月`;

    const beanTotal = allBeanPrices
      .filter((p) => {
        const pd = new Date(p.purchaseDate);
        return pd.getMonth() === m && pd.getFullYear() === y;
      })
      .reduce((sum, p) => sum + p.price, 0);

    const cafeTotal = allCafePrices
      .filter((p) => {
        const pd = new Date(p.purchaseDate);
        return pd.getMonth() === m && pd.getFullYear() === y;
      })
      .reduce((sum, p) => sum + p.price, 0);

    monthlyData.push({ month: label, beans: beanTotal, cafe: cafeTotal });
  }

  // Current month stats
  const thisMonthBeans = allBeanPrices
    .filter((p) => {
      const pd = new Date(p.purchaseDate);
      return pd.getMonth() === currentMonth && pd.getFullYear() === currentYear;
    });
  const thisMonthCafe = allCafePrices
    .filter((p) => {
      const pd = new Date(p.purchaseDate);
      return pd.getMonth() === currentMonth && pd.getFullYear() === currentYear;
    });

  const stats = {
    monthBeans: thisMonthBeans.reduce((s, p) => s + p.price, 0),
    monthCafe: thisMonthCafe.reduce((s, p) => s + p.price, 0),
    monthTotal: thisMonthBeans.reduce((s, p) => s + p.price, 0) + thisMonthCafe.reduce((s, p) => s + p.price, 0),
    monthCount: thisMonthBeans.length + thisMonthCafe.length,
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
