import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BeanDetailView } from "@/components/bean-detail-view";

export const dynamic = "force-dynamic";

export default async function BeanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beanId = parseInt(id, 10);
  if (isNaN(beanId)) notFound();

  const bean = await prisma.bean.findUnique({
    where: { id: beanId },
    include: {
      roaster: true,
      region: true,
      variety: true,
      purchases: { orderBy: { purchaseDate: "desc" } },
      brewLogs: { orderBy: { brewDate: "desc" } },
    },
  });
  if (!bean) notFound();

  const serialized = {
    id: bean.id,
    name: bean.name,
    process: bean.process,
    roastLevel: bean.roastLevel,
    flavorNotes: bean.flavorNotes,
    score: bean.score,
    roaster: bean.roaster ? { name: bean.roaster.name, country: bean.roaster.country } : null,
    region: bean.region ? { country: bean.region.country, region: bean.region.region } : null,
    variety: bean.variety ? { name: bean.variety.name, flavor: bean.variety.flavor } : null,
    purchases: bean.purchases.map((p: any) => ({
      id: p.id,
      price: p.price,
      weight: p.weight,
      purchaseDate: p.purchaseDate.toISOString(),
      source: p.source,
      notes: p.notes,
    })),
    brewLogs: bean.brewLogs.map((l: any) => ({
      id: l.id,
      brewMethod: l.brewMethod,
      dose: l.dose,
      waterAmount: l.waterAmount,
      ratio: l.ratio,
      grindSize: l.grindSize,
      waterTemp: l.waterTemp,
      brewTime: l.brewTime,
      rating: l.rating,
      notes: l.notes,
      brewDate: l.brewDate.toISOString(),
    })),
  };

  return <BeanDetailView initialBean={serialized} />;
}
