import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegionDialog } from "./region-dialog";

export default async function RegionsPage() {
  const regions = await prisma.region.findMany({ orderBy: { country: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌍 产区</h1>
        <RegionDialog />
      </div>
      {regions.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">暂无产区数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{r.country} · {r.region}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {r.subRegion && <p>子产区: {r.subRegion}</p>}
                <div className="flex flex-wrap gap-1">
                  {r.altitude && <Badge variant="outline">海拔 {r.altitude}</Badge>}
                  {r.climate && <Badge variant="secondary">{r.climate}</Badge>}
                </div>
                {r.notes && <p className="text-muted-foreground">{r.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
