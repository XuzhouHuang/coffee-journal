import { prisma } from "@/lib/db";
import { BeansList } from "@/components/beans-list";

export default async function BeansPage() {
  const [beansRaw, meta] = await Promise.all([
    prisma.bean.findMany({
      include: { roaster: true, region: true, variety: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    Promise.all([
      prisma.region.findMany({ orderBy: { country: "asc" } }),
      prisma.variety.findMany({ orderBy: { name: "asc" } }),
      prisma.roaster.findMany({ orderBy: { name: "asc" } }),
    ]).then(([regions, varieties, roasters]) => ({ regions, varieties, roasters })),
  ]);

  const beans = beansRaw.map((b) => ({
    id: b.id,
    name: b.name,
    process: b.process,
    roastLevel: b.roastLevel,
    flavorNotes: b.flavorNotes,
    score: b.score,
    roaster: b.roaster ? { id: b.roaster.id, name: b.roaster.name } : null,
    region: b.region ? { id: b.region.id, country: b.region.country, region: b.region.region } : null,
    variety: b.variety ? { id: b.variety.id, name: b.variety.name } : null,
  }));

  return <BeansList initialBeans={beans} meta={meta} />;
}
