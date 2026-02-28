import { prisma } from "@/lib/db";
import { PurchasesList } from "@/components/purchases-list";

export default async function PurchasesPage() {
  const [beanPurchasesRaw, cafePurchasesRaw] = await Promise.all([
    prisma.beanPurchase.findMany({
      include: { bean: true },
      orderBy: { purchaseDate: "desc" },
      take: 20,
    }),
    prisma.cafePurchase.findMany({
      orderBy: { purchaseDate: "desc" },
      take: 20,
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

  return (
    <PurchasesList
      initialBeanPurchases={beanPurchases}
      initialCafePurchases={cafePurchases}
    />
  );
}
