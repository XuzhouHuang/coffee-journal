"use client";
import { useAuth } from "@/components/auth-provider";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const { isAdmin } = useAuth();
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pt-4">
        <Link href="/beans">
          <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-[#9C9490] hover:text-[#8B7355]"><ArrowLeft className="h-4 w-4" strokeWidth={1.5} /></Button>
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-0.5">Bean Detail</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">{bean.name}</h1>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="pt-6 px-6 pb-6 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {bean.roastLevel && <Badge className="rounded-md bg-[#EBE5DD] text-[#8B7355] border-0 text-[11px] font-medium">{bean.roastLevel}</Badge>}
            {bean.process && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{bean.process}</Badge>}
            {bean.batch && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">批次 {bean.batch}</Badge>}
            {bean.roaster && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#9C9490] border-0 text-[11px]">{bean.roaster.name}</Badge>}
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {bean.origin && <div><span className="text-[#B8B0A8]">产地：</span><span className="text-[#2C2825]">{bean.origin}</span></div>}
            {bean.region && <div><span className="text-[#B8B0A8]">产区：</span><span className="text-[#2C2825]">{bean.region.country} · {bean.region.region}</span></div>}
            {bean.variety && <div><span className="text-[#B8B0A8]">品种：</span><span className="text-[#2C2825]">{bean.variety.name}{bean.species ? ` (${bean.species})` : ''}</span></div>}
            {!bean.variety && bean.species && <div><span className="text-[#B8B0A8]">豆种：</span><span className="text-[#2C2825]">{bean.species}</span></div>}
            {bean.altitude && <div><span className="text-[#B8B0A8]">海拔：</span><span className="text-[#2C2825]">{bean.altitude}</span></div>}
            {bean.station && <div><span className="text-[#B8B0A8]">处理站：</span><span className="text-[#2C2825]">{bean.station}</span></div>}
            {bean.producer && <div><span className="text-[#B8B0A8]">生产者：</span><span className="text-[#2C2825]">{bean.producer}</span></div>}
            {bean.roaster && <div><span className="text-[#B8B0A8]">烘焙商：</span><span className="text-[#2C2825]">{bean.roaster.name}{bean.roaster.country ? ` (${bean.roaster.country})` : ''}</span></div>}
            {bean.roastInfo && <div><span className="text-[#B8B0A8]">烘焙信息：</span><span className="text-[#2C2825]">{bean.roastInfo}</span></div>}
          </div>

          {bean.flavorNotes && <p className="text-sm text-[#6B6058] italic">{bean.flavorNotes}</p>}
          {bean.variety?.flavor && <p className="text-xs text-[#B8B0A8]">品种风味：{bean.variety.flavor}</p>}
          {bean.notes && <p className="text-sm text-[#9C9490]">{bean.notes}</p>}
          {bean.score != null && <p className="font-semibold text-gradient-accent text-base">评分: {bean.score}</p>}
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(200,168,130,0.1)] to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#6B6058]">购买记录</h2>
          {isAdmin && <Dialog open={purchaseOpen} onOpenChange={(open) => { setPurchaseOpen(open); if (open) setPurchaseKey((k) => k + 1); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-btn text-xs"><Plus className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />添加购买</Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader><DialogTitle>添加购买记录</DialogTitle></DialogHeader>
              <form key={purchaseKey} onSubmit={handlePurchase} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>价格 (元) *</Label><Input name="price" type="number" step="0.01" required className="rounded-lg bg-[#F5F0EB]" /></div>
                  <div><Label>重量 (g) *</Label><Input name="weight" type="number" required className="rounded-lg bg-[#F5F0EB]" /></div>
                </div>
                <div><Label>购买日期 *</Label><Input name="purchaseDate" type="date" required defaultValue={todayLocal()} className="rounded-lg bg-[#F5F0EB]" /></div>
                <div><Label>购买渠道</Label><Input name="source" placeholder="淘宝/官网/线下..." className="rounded-lg bg-[#F5F0EB]" /></div>
                <div><Label>备注</Label><Textarea name="notes" className="rounded-lg bg-[#F5F0EB]" /></div>
                <Button type="submit" className="w-full gradient-btn">保存</Button>
              </form>
            </DialogContent>
          </Dialog>}
        </div>
        {bean.purchases.length === 0 ? (
          <p className="text-[#B8B0A8] text-sm">暂无购买记录</p>
        ) : (
          <div className="overflow-x-auto glass-card p-4">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8E2DA]">
                  <TableHead className="text-[#B8B0A8] text-xs">日期</TableHead>
                  <TableHead className="text-[#B8B0A8] text-xs">价格</TableHead>
                  <TableHead className="text-[#B8B0A8] text-xs">重量</TableHead>
                  <TableHead className="text-[#B8B0A8] text-xs">单价</TableHead>
                  <TableHead className="text-[#B8B0A8] text-xs">渠道</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bean.purchases.map((p) => (
                  <TableRow key={p.id} className="border-[rgba(255,255,255,0.03)] hover:bg-[rgba(200,168,130,0.04)]">
                    <TableCell className="text-sm text-[#9C9490]">{new Date(p.purchaseDate).toLocaleDateString("zh-CN")}</TableCell>
                    <TableCell className="text-sm text-[#8B7355] font-medium">¥{p.price}</TableCell>
                    <TableCell className="text-sm text-[#9C9490]">{p.weight}g</TableCell>
                    <TableCell className="text-sm text-[#9C9490]">¥{(p.price / p.weight * 100).toFixed(0)}/100g</TableCell>
                    <TableCell className="text-sm text-[#B8B0A8]">{p.source || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(200,168,130,0.1)] to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#6B6058]">冲煮记录</h2>
          {isAdmin && <Link href={`/beans/${bean.id}/brew`}>
            <Button size="sm" className="gradient-btn text-xs"><Plus className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />添加冲煮</Button>
          </Link>}
        </div>
        {bean.brewLogs.length === 0 ? (
          <p className="text-[#B8B0A8] text-sm">暂无冲煮记录</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bean.brewLogs.map((log) => (
              <Card key={log.id} className="glass-card border-0">
                <CardHeader className="pb-2 px-5 pt-5">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="text-[#2C2825]">{log.brewMethod}</span>
                    {log.rating != null && <Badge variant="secondary" className="rounded-md bg-[#EBE5DD] text-[#8B7355] border-0 text-[11px]">⭐ {log.rating}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 px-5 pb-5">
                  <p className="text-[#B8B0A8] text-xs">{new Date(log.brewDate).toLocaleDateString("zh-CN")}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#9C9490]">
                    {log.dose != null && <span>粉量: {log.dose}g</span>}
                    {log.waterAmount != null && <span>水量: {log.waterAmount}ml</span>}
                    {log.ratio && <span>粉水比: {log.ratio}</span>}
                    {log.grindSize && <span>研磨: {log.grindSize}</span>}
                    {log.waterTemp != null && <span>水温: {log.waterTemp}°C</span>}
                    {log.brewTime && <span>时间: {log.brewTime}</span>}
                  </div>
                  {log.notes && <p className="pt-1 text-[#6B6058] text-xs">{log.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
