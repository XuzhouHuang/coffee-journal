"use client";
import { useAuth } from "@/components/auth-provider";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { BeanPurchase, CafePurchase } from "@/types";

interface EquipmentPurchase {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  price: number;
  purchaseDate: string;
  source: string | null;
  notes: string | null;
}

interface BreadPurchaseItem {
  id: number;
  bakeryName: string;
  location: string | null;
  breadName: string;
  breadType: string | null;
  price: number;
  purchaseDate: string;
  notes: string | null;
}

interface PurchaseStats {
  monthBeans: number;
  monthCafe: number;
  monthEquipment: number;
  monthBread: number;
  monthTotal: number;
  monthCount: number;
  monthlyData: { month: string; beans: number; cafe: number; equipment: number; bread: number }[];
}

interface PurchasesListProps {
  initialBeanPurchases: BeanPurchase[];
  initialCafePurchases: CafePurchase[];
  initialEquipmentPurchases: EquipmentPurchase[];
  initialBreadPurchases: BreadPurchaseItem[];
  stats: PurchaseStats;
}

export function PurchasesList({ initialBeanPurchases, initialCafePurchases, initialEquipmentPurchases, initialBreadPurchases, stats }: PurchasesListProps) {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<"beans" | "cafe" | "equipment" | "bread">("beans");
  const beanPurchases = initialBeanPurchases;
  const cafePurchases = initialCafePurchases;
  const equipmentPurchases = initialEquipmentPurchases;
  const breadPurchases = initialBreadPurchases;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Purchases</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">消费记录</h1>
        </div>
        {isAdmin && <Link href="/purchases/cafe/new">
          <Button className="gradient-btn"><Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />添加咖啡店消费</Button>
        </Link>}
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {[
          { label: "本月豆子消费", value: `¥${stats.monthBeans.toFixed(0)}` },
          { label: "本月咖啡店消费", value: `¥${stats.monthCafe.toFixed(0)}` },
          { label: "本月器具消费", value: `¥${stats.monthEquipment.toFixed(0)}` },
          { label: "本月面包消费", value: `¥${stats.monthBread.toFixed(0)}` },
          { label: "本月总消费", value: `¥${stats.monthTotal.toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-[12px] text-[#B8B0A8] mb-1">{s.label}</p>
            <p className="text-xl font-bold text-[#8B7355] tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <Card className="glass-card border-0">
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-sm font-semibold text-[#6B6058]">近6个月消费趋势</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <XAxis dataKey="month" tick={{ fill: '#9C9490', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9C9490', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => `¥${value}`}
                  contentStyle={{
                    background: 'rgba(42, 34, 26, 0.9)',
                    border: '1px solid rgba(200, 168, 130, 0.15)',
                    borderRadius: '8px',
                    color: '#2C2825',
                    fontSize: '13px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9C9490' }} />
                <Bar dataKey="beans" name="豆子" fill="#8B7355" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cafe" name="咖啡店" fill="#8A6340" radius={[4, 4, 0, 0]} />
                <Bar dataKey="equipment" name="器具" fill="#A0926B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bread" name="面包" fill="#C4956A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setTab("beans")}
          className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            tab === "beans"
              ? "bg-[#F0ECE6] text-[#8B7355]"
              : "text-[#B8B0A8] hover:text-[#6B6058] hover:bg-[#F5F0EB]"
          }`}
        >
          豆子购买 ({beanPurchases.length})
        </button>
        <button
          onClick={() => setTab("cafe")}
          className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            tab === "cafe"
              ? "bg-[#F0ECE6] text-[#8B7355]"
              : "text-[#B8B0A8] hover:text-[#6B6058] hover:bg-[#F5F0EB]"
          }`}
        >
          咖啡店消费 ({cafePurchases.length})
        </button>
        <button
          onClick={() => setTab("equipment")}
          className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            tab === "equipment"
              ? "bg-[#F0ECE6] text-[#8B7355]"
              : "text-[#B8B0A8] hover:text-[#6B6058] hover:bg-[#F5F0EB]"
          }`}
        >
          咖啡器具 ({equipmentPurchases.length})
        </button>
        <button
          onClick={() => setTab("bread")}
          className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            tab === "bread"
              ? "bg-[#F0ECE6] text-[#8B7355]"
              : "text-[#B8B0A8] hover:text-[#6B6058] hover:bg-[#F5F0EB]"
          }`}
        >
          面包 ({breadPurchases.length})
        </button>
      </div>

      {tab === "beans" && (
        <>
          {beanPurchases.length === 0 ? (
            <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无豆子购买记录，去咖啡豆页面添加</p>
          ) : (
            <div className="overflow-x-auto glass-card p-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8E2DA]">
                    <TableHead className="text-[#B8B0A8] text-xs">日期</TableHead>
                    <TableHead className="text-[#B8B0A8] text-xs">咖啡豆</TableHead>
                    <TableHead className="text-[#B8B0A8] text-xs">价格</TableHead>
                    <TableHead className="text-[#B8B0A8] text-xs">重量</TableHead>
                    <TableHead className="text-[#B8B0A8] text-xs">渠道</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beanPurchases.map((p) => (
                    <TableRow key={p.id} className="border-[rgba(255,255,255,0.03)] hover:bg-[rgba(200,168,130,0.04)]">
                      <TableCell className="text-sm text-[#9C9490]">{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</TableCell>
                      <TableCell>
                        {p.bean ? (
                          <Link href={`/beans/${p.bean.id}`} className="text-[#8B7355] hover:text-[#8B7355] transition-colors text-sm">
                            {p.bean.name}
                          </Link>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-[#8B7355] font-medium">¥{p.price}</TableCell>
                      <TableCell className="text-sm text-[#9C9490]">{p.weight}g</TableCell>
                      <TableCell className="text-sm text-[#B8B0A8]">{p.source || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {tab === "cafe" && (
        <>
          {cafePurchases.length === 0 ? (
            <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无咖啡店消费记录</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cafePurchases.map((p) => (
                <Card key={p.id} className="glass-card-interactive border-0">
                  <CardHeader className="pb-2 px-5 pt-5">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="text-[#2C2825]">{p.cafeName}</span>
                      <span className="text-sm font-medium text-[#8B7355]">¥{p.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 px-5 pb-5">
                    <p className="text-[#6B6058]">{p.drinkName}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.drinkType && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{p.drinkType}</Badge>}
                      {p.location && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">{p.location}</Badge>}
                    </div>
                    <div className="flex justify-between text-[#B8B0A8] text-xs pt-1">
                      <span>{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</span>
                      {p.rating != null && <span className="text-[#8B7355]">⭐ {p.rating}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "equipment" && (
        <>
          {equipmentPurchases.length === 0 ? (
            <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无器具购买记录</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentPurchases.map((p) => (
                <Card key={p.id} className="glass-card-interactive border-0">
                  <CardHeader className="pb-2 px-5 pt-5">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="text-[#2C2825]">{p.name}</span>
                      <span className="text-sm font-medium text-[#8B7355]">¥{p.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 px-5 pb-5">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{p.category}</Badge>
                      {p.brand && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">{p.brand}</Badge>}
                      {p.source && <Badge variant="secondary" className="rounded-md bg-[#F5F0EB] text-[#9C9490] border-0 text-[11px]">{p.source}</Badge>}
                    </div>
                    {p.notes && <p className="text-[#9C9490] text-xs">{p.notes}</p>}
                    <p className="text-[#B8B0A8] text-xs pt-1">{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "bread" && (
        <>
          {breadPurchases.length === 0 ? (
            <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无面包采购记录</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {breadPurchases.map((p) => (
                <Card key={p.id} className="glass-card-interactive border-0">
                  <CardHeader className="pb-2 px-5 pt-5">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="text-[#2C2825]">{p.bakeryName}</span>
                      <span className="text-sm font-medium text-[#8B7355]">¥{p.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 px-5 pb-5">
                    <p className="text-[#6B6058]">{p.breadName}</p>
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
        </>
      )}
    </div>
  );
}
