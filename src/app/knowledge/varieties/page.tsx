import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VarietyDialog } from "./variety-dialog";
import { AdminOnly } from "@/components/admin-only";

export const dynamic = "force-dynamic";

export default async function VarietiesPage() {
  const varieties = await prisma.variety.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Varieties</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🌱 品种</h1>
        </div>
        <AdminOnly><VarietyDialog /></AdminOnly>
      </div>
      {varieties.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无品种数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {varieties.map((v) => (
            <Card key={v.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#2C2825]">{v.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 px-5 pb-5">
                {v.description && <p className="text-[#9C9490] text-xs leading-relaxed">{v.description}</p>}
                {v.flavor && <p className="text-[#B8B0A8] text-xs">风味: {v.flavor}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
