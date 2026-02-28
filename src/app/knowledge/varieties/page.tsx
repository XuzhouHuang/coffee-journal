import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VarietyDialog } from "./variety-dialog";

export const dynamic = "force-dynamic";

export default async function VarietiesPage() {
  const varieties = await prisma.variety.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌱 品种</h1>
        <VarietyDialog />
      </div>
      {varieties.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">暂无品种数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {varieties.map((v) => (
            <Card key={v.id} className="glass-card border-0 hover:shadow-xl hover:shadow-teal-500/10 hover:scale-[1.02] transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{v.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {v.description && <p>{v.description}</p>}
                {v.flavor && <p className="text-muted-foreground">风味: {v.flavor}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
