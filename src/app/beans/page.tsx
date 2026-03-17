import { prisma } from "@/lib/db";
import { BeansList } from "@/components/beans-list";

export const dynamic = "force-dynamic";

export default async function BeansPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [beansRaw, meta, beanCount, inStockCount, monthBeanSpend] = await Promise.all([
    prisma.bean.findMany({
      include: { roaster: true, region: true, variety: true, purchases: { select: { weight: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    Promise.all([
      prisma.region.findMany({ orderBy: { country: "asc" } }),
      prisma.variety.findMany({ orderBy: { name: "asc" } }),
      prisma.roaster.findMany({ orderBy: { name: "asc" } }),
    ]).then(([regions, varieties, roasters]) => ({ regions, varieties, roasters })),
    prisma.bean.count(),
    prisma.bean.count({ where: { status: "在库" } }),
    prisma.beanPurchase.aggregate({ _sum: { price: true }, where: { purchaseDate: { gte: startOfMonth } } }),
  ]);

  const beans = beansRaw.map((b) => ({
    id: b.id,
    name: b.name,
    origin: b.origin,
    altitude: b.altitude,
    species: b.species,
    process: b.process,
    roastLevel: b.roastLevel,
    roastInfo: b.roastInfo,
    producer: b.producer,
    station: b.station,
    batch: b.batch,
    flavorNotes: b.flavorNotes,
    notes: b.notes,
    score: b.score,
    status: b.status,
    roaster: b.roaster ? { id: b.roaster.id, name: b.roaster.name } : null,
    region: b.region ? { id: b.region.id, country: b.region.country, region: b.region.region } : null,
    variety: b.variety ? { id: b.variety.id, name: b.variety.name } : null,
    purchases: b.purchases.map((p) => ({ weight: p.weight })),
  }));

  const stats = {
    total: beanCount,
    inStock: inStockCount,
    monthSpend: monthBeanSpend._sum.price || 0,
  };

  return <BeansList initialBeans={beans} meta={meta} stats={stats} />;
}
