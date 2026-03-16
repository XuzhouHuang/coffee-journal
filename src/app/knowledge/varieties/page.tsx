import { prisma } from "@/lib/db";
import { VarietyDialog } from "./variety-dialog";
import { AdminOnly } from "@/components/admin-only";
import { VarietiesList } from "./varieties-list";

export const dynamic = "force-dynamic";

export default async function VarietiesPage() {
  const varieties = await prisma.variety.findMany({ orderBy: { name: "asc" } });

  const serialized = varieties.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    flavor: v.flavor,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Varieties</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🌱 品种</h1>
        </div>
        <AdminOnly><VarietyDialog /></AdminOnly>
      </div>
      <VarietiesList varieties={serialized} />
    </div>
  );
}
