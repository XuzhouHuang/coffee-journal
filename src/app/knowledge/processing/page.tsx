import { prisma } from "@/lib/db";
import { ProcessingDialog } from "./processing-dialog";
import { AdminOnly } from "@/components/admin-only";
import { ProcessingList } from "./processing-list";

export const dynamic = "force-dynamic";
export default async function ProcessingPage() {
  const methods = await prisma.processingMethod.findMany({ orderBy: { name: "asc" } });

  const serialized = methods.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    flavorNotes: m.flavorNotes,
    suitable: m.suitable,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Processing Methods</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">🧪 处理法</h1>
        </div>
        <AdminOnly><ProcessingDialog /></AdminOnly>
      </div>
      <ProcessingList methods={serialized} />
    </div>
  );
}
