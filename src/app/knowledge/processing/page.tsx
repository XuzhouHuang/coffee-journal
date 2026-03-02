import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessingDialog } from "./processing-dialog";

export const dynamic = "force-dynamic";
export default async function ProcessingPage() {
  const methods = await prisma.processingMethod.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🧪 处理法</h1>
        <ProcessingDialog />
      </div>
      {methods.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">暂无处理法数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <Card key={m.id} className="glass-card border-0 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{m.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {m.description && <p className="text-muted-foreground">{m.description}</p>}
                {m.flavorNotes && (
                  <div>
                    <Badge variant="secondary" className="rounded-full bg-purple-500/20 text-purple-300 mb-1">风味特点</Badge>
                    <p className="text-muted-foreground text-xs mt-1">{m.flavorNotes}</p>
                  </div>
                )}
                {m.suitable && (
                  <div>
                    <Badge variant="outline" className="rounded-full">适合场景</Badge>
                    <p className="text-muted-foreground text-xs mt-1">{m.suitable}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
