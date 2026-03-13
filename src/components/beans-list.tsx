"use client";
import { useAuth } from "@/components/auth-provider";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Bean, Meta } from "@/types";

interface BeansListProps {
  initialBeans: Bean[];
  meta: Meta;
}

export function BeansList({ initialBeans, meta }: BeansListProps) {
  const { isAdmin } = useAuth();
  const [beans, setBeans] = useState<Bean[]>(initialBeans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [filterRegion, setFilterRegion] = useState("");
  const [filterVariety, setFilterVariety] = useState("");
  const [search, setSearch] = useState("");

  const filtered = beans.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion && filterRegion !== "all" && b.region?.id !== parseInt(filterRegion)) return false;
    if (filterVariety && filterVariety !== "all" && b.variety?.id !== parseInt(filterVariety)) return false;
    return true;
  });

  const handleOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (open) setDialogKey((k) => k + 1);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/beans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          regionId: data.regionId ? parseInt(data.regionId as string) : null,
          varietyId: data.varietyId ? parseInt(data.varietyId as string) : null,
          roasterId: data.roasterId ? parseInt(data.roasterId as string) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "请求失败" }));
        toast.error(err.error || "添加失败");
        return;
      }
      const bean = await res.json();
      setBeans((prev) => [bean, ...prev]);
      setDialogOpen(false);
      toast.success("咖啡豆添加成功！");
    } catch {
      toast.error("网络错误，请重试");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Bean Collection</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">咖啡豆</h1>
        </div>
        {isAdmin && <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gradient-btn"><Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />添加咖啡豆</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto glass-card">
            <DialogHeader>
              <DialogTitle>添加咖啡豆</DialogTitle>
            </DialogHeader>
            <form key={dialogKey} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>豆名 *</Label>
                <Input name="name" required className="rounded-lg bg-[#F5F0EB]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>产区</Label>
                  <Select name="regionId">
                    <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="选择产区" /></SelectTrigger>
                    <SelectContent>
                      {meta.regions.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>{r.country} - {r.region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>品种</Label>
                  <Select name="varietyId">
                    <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="选择品种" /></SelectTrigger>
                    <SelectContent>
                      {meta.varieties.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>烘焙商</Label>
                <Select name="roasterId">
                  <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="选择烘焙商" /></SelectTrigger>
                  <SelectContent>
                    {meta.roasters.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>处理法</Label>
                  <Input name="process" placeholder="水洗/日晒/蜜处理..." className="rounded-lg bg-[#F5F0EB]" />
                </div>
                <div>
                  <Label>烘焙度</Label>
                  <Input name="roastLevel" placeholder="浅/中/深" className="rounded-lg bg-[#F5F0EB]" />
                </div>
              </div>
              <div>
                <Label>风味描述</Label>
                <Textarea name="flavorNotes" placeholder="花香、柑橘、巧克力..." className="rounded-lg bg-[#F5F0EB]" />
              </div>
              <div>
                <Label>评分</Label>
                <Input name="score" type="number" step="0.1" min="0" max="5" className="rounded-lg bg-[#F5F0EB]" />
              </div>
              <Button type="submit" className="w-full gradient-btn">保存</Button>
            </form>
          </DialogContent>
        </Dialog>}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="搜索豆名..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs rounded-lg bg-[#F5F0EB]"
        />
        <Select value={filterRegion} onValueChange={setFilterRegion}>
          <SelectTrigger className="sm:max-w-[180px] rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="筛选产区" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部产区</SelectItem>
            {meta.regions.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>{r.country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterVariety} onValueChange={setFilterVariety}>
          <SelectTrigger className="sm:max-w-[180px] rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="筛选品种" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部品种</SelectItem>
            {meta.varieties.map((v) => (
              <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {beans.length >= 20 && (search || (filterRegion && filterRegion !== "all") || (filterVariety && filterVariety !== "all")) && (
        <p className="text-xs text-[#B8B0A8]">仅在已加载的 {beans.length} 条数据中筛选</p>
      )}

      {/* Bean list */}
      {filtered.length === 0 ? (
        <p className="text-[#B8B0A8] py-12 text-center text-sm">暂无咖啡豆，点击上方按钮添加</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bean) => (
            <Link key={bean.id} href={`/beans/${bean.id}`}>
              <Card className="glass-card-interactive border-0 h-full">
                <CardHeader className="pb-2 px-5 pt-5">
                  <CardTitle className="text-base text-[#2C2825]">{bean.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5">
                  <div className="flex flex-wrap gap-1.5">
                    {bean.region && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px] font-medium">{bean.region.country}</Badge>}
                    {bean.variety && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{bean.variety.name}</Badge>}
                    {bean.roastLevel && <Badge className="rounded-md bg-[#EBE5DD] text-[#8B7355] border-0 text-[11px] font-medium">{bean.roastLevel}</Badge>}
                    {bean.process && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{bean.process}</Badge>}
                  </div>
                  {bean.roaster && (
                    <p className="text-xs text-[#B8B0A8]">烘焙商: {bean.roaster.name}</p>
                  )}
                  {bean.flavorNotes && (
                    <p className="text-xs text-[#9C9490] leading-relaxed">{bean.flavorNotes}</p>
                  )}
                  {bean.score != null && (
                    <p className="text-sm font-semibold text-gradient-accent">评分: {bean.score}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
