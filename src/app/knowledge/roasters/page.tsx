import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoasterDialog } from "./roaster-dialog";

export const dynamic = "force-dynamic";
export default async function RoastersPage() {
  const roasters = await prisma.roaster.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Roasters</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🔥 烘焙商</h1>
        </div>
        <RoasterDialog />
      </div>
      {roasters.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无烘焙商数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roasters.map((r) => (
            <Card key={r.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="text-[#2C2825]">{r.name}</span>
                  <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{r.country}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 px-5 pb-5">
                {r.specialty && <p className="text-[#9C9490] text-xs">特色: {r.specialty}</p>}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#8B7355] transition-colors block truncate text-xs">
                    {r.website}
                  </a>
                )}
                {r.shopUrl && (
                  <a href={r.shopUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#8B7355] transition-colors block truncate text-xs">
                    店铺链接
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
