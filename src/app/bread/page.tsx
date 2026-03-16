import { prisma } from "@/lib/db";
import { BreadPurchasesList } from "@/components/bread-purchases-list";

export const dynamic = "force-dynamic";

export default async function BreadPage() {
  const purchases = await prisma.breadPurchase.findMany({
    orderBy: { purchaseDate: "desc" },
  });

  const serialized = purchases.map((p) => ({
    id: p.id,
    bakeryName: p.bakeryName,
    location: p.location,
    breadName: p.breadName,
    breadType: p.breadType,
    price: p.price,
    purchaseDate: p.purchaseDate.toISOString(),
    notes: p.notes,
  }));

  return <BreadPurchasesList initialPurchases={serialized} />;
}
