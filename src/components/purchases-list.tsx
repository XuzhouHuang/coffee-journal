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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">消费记录</h1>
        <Link href="/purchases/cafe/new">
          <Button><Plus className="h-4 w-4 mr-2" />添加咖啡店消费</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">本月豆子消费</p>
            <p className="text-2xl font-bold">¥{stats.monthBeans.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">本月咖啡店消费</p>
            <p className="text-2xl font-bold">¥{stats.monthCafe.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">本月总消费</p>
            <p className="text-2xl font-bold">¥{stats.monthTotal.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">本月消费次数</p>
            <p className="text-2xl font-bold">{stats.monthCount} 次</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">近6个月消费趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value}`} />
                <Legend />
                <Bar dataKey="beans" name="豆子" fill="#3b82f6" />
                <Bar dataKey="cafe" name="咖啡店" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant={tab === "beans" ? "default" : "outline"}
          onClick={() => setTab("beans")}
          size="sm"
        >
          豆子购买 ({beanPurchases.length})
        </Button>
        <Button
          variant={tab === "cafe" ? "default" : "outline"}
          onClick={() => setTab("cafe")}
          size="sm"
        >
          咖啡店消费 ({cafePurchases.length})
        </Button>
      </div>

      {tab === "beans" && (
        <>
          {beanPurchases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">暂无豆子购买记录，去咖啡豆页面添加</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>咖啡豆</TableHead>
                    <TableHead>价格</TableHead>
                    <TableHead>重量</TableHead>
                    <TableHead>渠道</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beanPurchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</TableCell>
                      <TableCell>
                        {p.bean ? (
                          <Link href={`/beans/${p.bean.id}`} className="text-primary hover:underline">
                            {p.bean.name}
                          </Link>
                        ) : "-"}
                      </TableCell>
                      <TableCell>¥{p.price}</TableCell>
                      <TableCell>{p.weight}g</TableCell>
                      <TableCell>{p.source || "-"}</TableCell>
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
            <p className="text-muted-foreground text-center py-8">暂无咖啡店消费记录</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cafePurchases.map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{p.cafeName}</span>
                      <span className="text-sm font-normal">¥{p.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>{p.drinkName}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.drinkType && <Badge variant="outline">{p.drinkType}</Badge>}
                      {p.location && <Badge variant="secondary">{p.location}</Badge>}
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</span>
                      {p.rating != null && <span>⭐ {p.rating}</span>}
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
