"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { todayLocal } from "@/lib/utils";
import type { BeanDetail } from "@/types";

interface BeanDetailViewProps {
  initialBean: BeanDetail;
}

export function BeanDetailView({ initialBean }: BeanDetailViewProps) {
  const router = useRouter();
  const [bean, setBean] = useState<BeanDetail>(initialBean);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseKey, setPurchaseKey] = useState(0);

  useEffect(() => {
    setBean(initialBean);
  }, [initialBean]);

  async function handlePurchase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const res = await fetch(`/api/beans/${bean.id}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "请求失败" }));
        toast.error(err.error || "添加失败");
        return;
      }
      setPurchaseOpen(false);
      setPurchaseKey((k) => k + 1);
      router.refresh();
      toast.success("购买记录添加成功！");
    } catch {
      toast.error("网络错误，请重试");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/beans">
          <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">{bean.name}</h1>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="pt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {bean.region && <Badge variant="secondary" className="rounded-full bg-teal-100/60 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{bean.region.country} - {bean.region.region}</Badge>}
            {bean.variety && <Badge variant="outline" className="rounded-full">{bean.variety.name}</Badge>}
            {bean.roastLevel && <Badge className="rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-white border-0">{bean.roastLevel}</Badge>}
            {bean.process && <Badge variant="outline" className="rounded-full">{bean.process}</Badge>}
          </div>
          {bean.roaster && <p className="text-sm">烘焙商: {bean.roaster.name} ({bean.roaster.country})</p>}
          {bean.flavorNotes && <p className="text-sm">风味: {bean.flavorNotes}</p>}
          {bean.variety?.flavor && <p className="text-sm text-muted-foreground">品种风味: {bean.variety.flavor}</p>}
          {bean.score != null && <p className="text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">评分: {bean.score}</p>}
        </CardContent>
      </Card>

      <Separator className="opacity-30" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">购买记录</h2>
          <Dialog open={purchaseOpen} onOpenChange={(open) => { setPurchaseOpen(open); if (open) setPurchaseKey((k) => k + 1); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-btn"><Plus className="h-4 w-4 mr-1" />添加购买</Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader><DialogTitle>添加购买记录</DialogTitle></DialogHeader>
              <form key={purchaseKey} onSubmit={handlePurchase} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>价格 (元) *</Label><Input name="price" type="number" step="0.01" required className="rounded-xl bg-white/40 dark:bg-white/10" /></div>
                  <div><Label>重量 (g) *</Label><Input name="weight" type="number" required className="rounded-xl bg-white/40 dark:bg-white/10" /></div>
                </div>
                <div><Label>购买日期 *</Label><Input name="purchaseDate" type="date" required defaultValue={todayLocal()} className="rounded-xl bg-white/40 dark:bg-white/10" /></div>
                <div><Label>购买渠道</Label><Input name="source" placeholder="淘宝/官网/线下..." className="rounded-xl bg-white/40 dark:bg-white/10" /></div>
                <div><Label>备注</Label><Textarea name="notes" className="rounded-xl bg-white/40 dark:bg-white/10" /></div>
                <Button type="submit" className="w-full gradient-btn">保存</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {bean.purchases.length === 0 ? (
          <p className="text-muted-foreground text-sm">暂无购买记录</p>
        ) : (
          <div className="overflow-x-auto glass-card p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>重量</TableHead>
                  <TableHead>单价</TableHead>
                  <TableHead>渠道</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bean.purchases.map((p) => (
                  <TableRow key={p.id} className="hover:bg-white/30 dark:hover:bg-white/5">
                    <TableCell>{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</TableCell>
                    <TableCell>¥{p.price}</TableCell>
                    <TableCell>{p.weight}g</TableCell>
                    <TableCell>¥{(p.price / p.weight * 100).toFixed(0)}/100g</TableCell>
                    <TableCell>{p.source || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Separator className="opacity-30" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">冲煮记录</h2>
          <Link href={`/beans/${bean.id}/brew`}>
            <Button size="sm" className="gradient-btn"><Plus className="h-4 w-4 mr-1" />添加冲煮</Button>
          </Link>
        </div>
        {bean.brewLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">暂无冲煮记录</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bean.brewLogs.map((log) => (
              <Card key={log.id} className="glass-card border-0 hover:shadow-xl hover:shadow-teal-500/10 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{log.brewMethod}</span>
                    {log.rating != null && <Badge variant="secondary" className="rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-white border-0">⭐ {log.rating}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="text-muted-foreground">{new Date(log.brewDate).toLocaleDateString("zh-CN")}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                    {log.dose != null && <span>粉量: {log.dose}g</span>}
                    {log.waterAmount != null && <span>水量: {log.waterAmount}ml</span>}
                    {log.ratio && <span>粉水比: {log.ratio}</span>}
                    {log.grindSize && <span>研磨: {log.grindSize}</span>}
                    {log.waterTemp != null && <span>水温: {log.waterTemp}°C</span>}
                    {log.brewTime && <span>时间: {log.brewTime}</span>}
                  </div>
                  {log.notes && <p className="pt-1">{log.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
