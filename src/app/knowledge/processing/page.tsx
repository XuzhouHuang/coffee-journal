import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessingDialog } from "./processing-dialog";

export const dynamic = "force-dynamic";
export default async function ProcessingPage() {
  const methods = await prisma.processingMethod.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B5D50] mb-1">Processing Methods</p>
          <h1 className="text-2xl font-bold text-[#F0EDE8] tracking-tight">🧪 处理法</h1>
        </div>
        <ProcessingDialog />
      </div>
      {methods.length === 0 ? (
        <p className="text-[#6B5D50] text-center py-12 text-sm">暂无处理法数据，点击右上角添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <Card key={m.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#F0EDE8]">{m.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 px-5 pb-5">
                {m.description && <p className="text-[#8A7B6E] text-xs leading-relaxed">{m.description}</p>}
                {m.flavorNotes && (
                  <div>
                    <Badge variant="secondary" className="rounded-md bg-[rgba(200,168,130,0.1)] text-[#C8A882] border-0 text-[11px] mb-1.5">风味特点</Badge>
                    <p className="text-[#6B5D50] text-xs">{m.flavorNotes}</p>
                  </div>
                )}
                {m.suitable && (
                  <div>
                    <Badge variant="outline" className="rounded-md text-[11px] border-[rgba(255,255,255,0.08)] text-[#8A7B6E]">适合场景</Badge>
                    <p className="text-[#6B5D50] text-xs mt-1">{m.suitable}</p>
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
