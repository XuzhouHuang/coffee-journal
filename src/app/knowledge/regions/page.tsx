import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegionDialog } from "./region-dialog";

export const dynamic = "force-dynamic";
export default async function RegionsPage() {
  const regions = await prisma.region.findMany({ orderBy: { country: "asc" } });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B5D50] mb-1">Origins</p>
          <h1 className="text-2xl font-bold text-[#F0EDE8] tracking-tight">🌍 产区</h1>
        </div>
        <RegionDialog />
      </div>
      {regions.length === 0 ? (
        <p className="text-[#6B5D50] text-center py-12 text-sm">暂无产区数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <Card key={r.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#F0EDE8]">{r.country} · {r.region}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 px-5 pb-5">
                {r.subRegion && <p className="text-[#8A7B6E] text-xs">子产区: {r.subRegion}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {r.altitude && <Badge variant="outline" className="rounded-md text-[11px] border-[rgba(255,255,255,0.08)] text-[#8A7B6E]">海拔 {r.altitude}</Badge>}
                  {r.climate && <Badge variant="secondary" className="rounded-md bg-[rgba(200,168,130,0.1)] text-[#C8A882] border-0 text-[11px]">{r.climate}</Badge>}
                </div>
                {r.notes && <p className="text-[#6B5D50] text-xs leading-relaxed">{r.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
