import { prisma } from "@/lib/db";
import { RegionDialog } from "./region-dialog";
import { AdminOnly } from "@/components/admin-only";
import { RegionsList } from "./regions-list";

export const dynamic = "force-dynamic";
export default async function RegionsPage() {
  const regions = await prisma.region.findMany({ orderBy: { country: "asc" } });

  const serialized = regions.map((r) => ({
    id: r.id,
    country: r.country,
    region: r.region,
    subRegion: r.subRegion,
    altitude: r.altitude,
    climate: r.climate,
    notes: r.notes,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Origins</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🌍 产区</h1>
        </div>
        <AdminOnly><RegionDialog /></AdminOnly>
      </div>
      <RegionsList regions={serialized} />
    </div>
  );
}
