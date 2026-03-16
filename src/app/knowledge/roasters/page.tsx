import { prisma } from "@/lib/db";
import { RoasterDialog } from "./roaster-dialog";
import { AdminOnly } from "@/components/admin-only";
import { RoastersList } from "./roasters-list";

export const dynamic = "force-dynamic";
export default async function RoastersPage() {
  const roasters = await prisma.roaster.findMany({ orderBy: { name: "asc" } });

  const serialized = roasters.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    specialty: r.specialty,
    website: r.website,
    shopUrl: r.shopUrl,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Roasters</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🔥 烘焙商</h1>
        </div>
        <AdminOnly><RoasterDialog /></AdminOnly>
      </div>
      <RoastersList roasters={serialized} />
    </div>
  );
}
