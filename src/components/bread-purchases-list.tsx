"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntityDialog } from "@/components/entity-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BreadPurchase {
  id: number;
  bakeryName: string;
  location: string | null;
  breadName: string;
  breadType: string | null;
  price: number;
  purchaseDate: string;
  notes: string | null;
}

interface Props {
  initialPurchases: BreadPurchase[];
}

const breadPurchaseFields = [
  { name: "bakeryName", label: "面包店", required: true, placeholder: "例：巴黎贝甜" },
  { name: "location", label: "地点", placeholder: "例：无锡恒隆广场" },
  { name: "breadName", label: "面包名", required: true, placeholder: "例：法式可颂" },
  { name: "breadType", label: "类型", placeholder: "吐司/法棍/可颂/贝果/欧包/其他" },
  { name: "price", label: "价格", required: true, placeholder: "例：15" },
  { name: "purchaseDate", label: "购买日期", required: true, placeholder: "2026-03-16" },
  { name: "notes", label: "备注", type: "textarea" as const, placeholder: "口感、推荐度等" },
];

export function BreadPurchasesList({ initialPurchases }: Props) {
  const purchases = initialPurchases;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Bread Purchases</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">面包采购记录</h1>
        </div>
        <EntityDialog
          title="添加面包采购"
          buttonLabel="添加记录"
          apiEndpoint="/api/bread-purchases"
          fields={breadPurchaseFields}
        />
      </div>

      {purchases.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无面包采购记录</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((p) => (
            <Card key={p.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="text-[#2C2825]">{p.breadName}</span>
                  <span className="text-sm font-medium text-[#8B7355]">¥{p.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 px-5 pb-5">
                <p className="text-[#6B6058]">{p.bakeryName}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.breadType && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{p.breadType}</Badge>}
                  {p.location && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">{p.location}</Badge>}
                </div>
                {p.notes && <p className="text-[#9C9490] text-xs">{p.notes}</p>}
                <p className="text-[#B8B0A8] text-xs pt-1">{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
