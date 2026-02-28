import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoasterDialog } from "./roaster-dialog";

export const dynamic = "force-dynamic";
export default async function RoastersPage() {
  const roasters = await prisma.roaster.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🔥 烘焙商</h1>
        <RoasterDialog />
      </div>
      {roasters.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">暂无烘焙商数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roasters.map((r) => (
            <Card key={r.id} className="glass-card border-0 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{r.name}</span>
                  <Badge variant="outline" className="rounded-full">{r.country}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {r.specialty && <p>特色: {r.specialty}</p>}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                    {r.website}
                  </a>
                )}
                {r.shopUrl && (
                  <a href={r.shopUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
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
