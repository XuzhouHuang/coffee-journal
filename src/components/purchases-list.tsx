"use client";

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

interface PurchaseStats {
  monthBeans: number;
  monthCafe: number;
  monthTotal: number;
  monthCount: number;
  monthlyData: { month: string; beans: number; cafe: number }[];
}

interface PurchasesListProps {
  initialBeanPurchases: BeanPurchase[];
  initialCafePurchases: CafePurchase[];
  stats: PurchaseStats;
}

export function PurchasesList({ initialBeanPurchases, initialCafePurchases, stats }: PurchasesListProps) {
  const [tab, setTab] = useState<"beans" | "cafe">("beans");
  const beanPurchases = initialBeanPurchases;
  const cafePurchases = initialCafePurchases;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B5D50] mb-1">Purchases</p>
          <h1 className="text-2xl font-bold text-[#F0EDE8] tracking-tight">消费记录</h1>
        </div>
        <Link href="/purchases/cafe/new">
          <Button className="gradient-btn"><Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />添加咖啡店消费</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "本月豆子消费", value: `¥${stats.monthBeans.toFixed(0)}` },
          { label: "本月咖啡店消费", value: `¥${stats.monthCafe.toFixed(0)}` },
          { label: "本月总消费", value: `¥${stats.monthTotal.toFixed(0)}` },
          { label: "本月消费次数", value: `${stats.monthCount} 次` },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-[12px] text-[#6B5D50] mb-1">{s.label}</p>
            <p className="text-xl font-bold text-[#D4B896] tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <Card className="glass-card border-0">
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-sm font-semibold text-[#C8B4A0]">近6个月消费趋势</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <XAxis dataKey="month" tick={{ fill: '#6B5D50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B5D50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => `¥${value}`}
                  contentStyle={{
                    background: 'rgba(42, 34, 26, 0.9)',
                    border: '1px solid rgba(200, 168, 130, 0.15)',
                    borderRadius: '8px',
                    color: '#F0EDE8',
                    fontSize: '13px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#8A7B6E' }} />
                <Bar dataKey="beans" name="豆子" fill="#C8A882" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cafe" name="咖啡店" fill="#8A6340" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("beans")}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "beans"
              ? "bg-[rgba(200,168,130,0.12)] text-[#D4B896]"
              : "text-[#6B5D50] hover:text-[#C8B4A0] hover:bg-[rgba(255,255,255,0.03)]"
          }`}
        >
          豆子购买 ({beanPurchases.length})
        </button>
        <button
          onClick={() => setTab("cafe")}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "cafe"
              ? "bg-[rgba(200,168,130,0.12)] text-[#D4B896]"
              : "text-[#6B5D50] hover:text-[#C8B4A0] hover:bg-[rgba(255,255,255,0.03)]"
          }`}
        >
          咖啡店消费 ({cafePurchases.length})
        </button>
      </div>

      {tab === "beans" && (
        <>
          {beanPurchases.length === 0 ? (
            <p className="text-[#6B5D50] text-center py-12 text-sm">暂无豆子购买记录，去咖啡豆页面添加</p>
          ) : (
            <div className="overflow-x-auto glass-card p-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(255,255,255,0.05)]">
                    <TableHead className="text-[#6B5D50] text-xs">日期</TableHead>
                    <TableHead className="text-[#6B5D50] text-xs">咖啡豆</TableHead>
                    <TableHead className="text-[#6B5D50] text-xs">价格</TableHead>
                    <TableHead className="text-[#6B5D50] text-xs">重量</TableHead>
                    <TableHead className="text-[#6B5D50] text-xs">渠道</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beanPurchases.map((p) => (
                    <TableRow key={p.id} className="border-[rgba(255,255,255,0.03)] hover:bg-[rgba(200,168,130,0.04)]">
                      <TableCell className="text-sm text-[#8A7B6E]">{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</TableCell>
                      <TableCell>
                        {p.bean ? (
                          <Link href={`/beans/${p.bean.id}`} className="text-[#C8A882] hover:text-[#D4B896] transition-colors text-sm">
                            {p.bean.name}
                          </Link>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-[#D4B896] font-medium">¥{p.price}</TableCell>
                      <TableCell className="text-sm text-[#8A7B6E]">{p.weight}g</TableCell>
                      <TableCell className="text-sm text-[#6B5D50]">{p.source || "-"}</TableCell>
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
            <p className="text-[#6B5D50] text-center py-12 text-sm">暂无咖啡店消费记录</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cafePurchases.map((p) => (
                <Card key={p.id} className="glass-card-interactive border-0">
                  <CardHeader className="pb-2 px-5 pt-5">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="text-[#F0EDE8]">{p.cafeName}</span>
                      <span className="text-sm font-medium text-[#C8A882]">¥{p.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 px-5 pb-5">
                    <p className="text-[#C8B4A0]">{p.drinkName}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.drinkType && <Badge variant="outline" className="rounded-md text-[11px] border-[rgba(255,255,255,0.08)] text-[#8A7B6E]">{p.drinkType}</Badge>}
                      {p.location && <Badge variant="secondary" className="rounded-md bg-[rgba(200,168,130,0.1)] text-[#C8A882] border-0 text-[11px]">{p.location}</Badge>}
                    </div>
                    <div className="flex justify-between text-[#6B5D50] text-xs pt-1">
                      <span>{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</span>
                      {p.rating != null && <span className="text-[#C8A882]">⭐ {p.rating}</span>}
                    </div>
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
