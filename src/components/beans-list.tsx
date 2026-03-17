"use client";
import { useAuth } from "@/components/auth-provider";

import { useState, useCallback, useEffect, useMemo } from "react";
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

interface BeanStats {
  total: number;
  inStock: number;
  monthSpend: number;
}

interface BeansListProps {
  initialBeans: Bean[];
  meta: Meta;
  stats?: BeanStats;
}

export function BeansList({ initialBeans, meta, stats }: BeansListProps) {
  const { isAdmin } = useAuth();
  const [beans, setBeans] = useState<Bean[]>(initialBeans);

  useEffect(() => { setBeans(initialBeans); }, [initialBeans]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [filterProcess, setFilterProcess] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  // Derive filter options from actual bean data
  const processOptions = useMemo(() => {
    const set = new Set<string>();
    beans.forEach(b => { if (b.process) set.add(b.process); });
    return Array.from(set).sort();
  }, [beans]);

  const filtered = beans.filter((b) => {
    if (search) {
      const s = search.toLowerCase();
      if (!b.name.toLowerCase().includes(s) 
        && !(b.origin && b.origin.toLowerCase().includes(s))
        && !(b.species && b.species.toLowerCase().includes(s))
        && !(b.variety?.name && b.variety.name.toLowerCase().includes(s))
        && !(b.region?.country && b.region.country.toLowerCase().includes(s))
      ) return false;
    }
    if (filterProcess && filterProcess !== "all" && b.process !== filterProcess) return false;
    if (filterStatus && filterStatus !== "all" && b.status !== filterStatus) return false;
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
        <div className="flex items-center gap-2">
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
              <div>
                <Label>产地详情</Label>
                <Input name="origin" placeholder="埃塞俄比亚 西达摩 班莎" className="rounded-lg bg-[#F5F0EB]" />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>豆种</Label>
                  <Input name="species" placeholder="Arabica/Robusta..." className="rounded-lg bg-[#F5F0EB]" />
                </div>
                <div>
                  <Label>海拔</Label>
                  <Input name="altitude" placeholder="1800-2100m" className="rounded-lg bg-[#F5F0EB]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>处理法</Label>
                  <Input name="process" placeholder="水洗/日晒/蜜处理..." className="rounded-lg bg-[#F5F0EB]" />
                </div>
                <div>
                  <Label>处理站</Label>
                  <Input name="station" placeholder="处理站名称" className="rounded-lg bg-[#F5F0EB]" />
                </div>
              </div>
              <div>
                <Label>生产商/生产者</Label>
                <Input name="producer" placeholder="生产商 · 生产者" className="rounded-lg bg-[#F5F0EB]" />
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
                  <Label>烘焙度</Label>
                  <Input name="roastLevel" placeholder="浅/中/深" className="rounded-lg bg-[#F5F0EB]" />
                </div>
                <div>
                  <Label>批次</Label>
                  <Input name="batch" placeholder="批次号" className="rounded-lg bg-[#F5F0EB]" />
                </div>
              </div>
              <div>
                <Label>烘焙信息</Label>
                <Input name="roastInfo" placeholder="烘焙设备、色卡号等" className="rounded-lg bg-[#F5F0EB]" />
              </div>
              <div>
                <Label>风味描述</Label>
                <Textarea name="flavorNotes" placeholder="花香、柑橘、巧克力..." className="rounded-lg bg-[#F5F0EB]" />
              </div>
              <div>
                <Label>状态</Label>
                <Select name="status">
                  <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="选择状态" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="在库">在库</SelectItem>
                    <SelectItem value="已用完">已用完</SelectItem>
                  </SelectContent>
                </Select>
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
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-3 grid-cols-3">
          {[
            { label: "咖啡豆种类", value: `${stats.total} 款` },
            { label: "在库", value: `${stats.inStock} 款` },
            { label: "本月消费", value: `¥${stats.monthSpend.toFixed(0)}` },
          ].map((s) => (
            <div key={s.label} className="glass-card px-3 py-2.5 sm:px-4 sm:py-3 text-center">
              <p className="text-[22px] sm:text-2xl font-bold text-[#8B7355] tracking-tight leading-none">{s.value}</p>
              <p className="text-[10px] sm:text-[11px] text-[#B8B0A8] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="搜索豆名/产地/品种..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg bg-[#F5F0EB]"
        />
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
        <Select value={filterProcess} onValueChange={setFilterProcess}>
          <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="筛选处理法" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部处理法</SelectItem>
            {processOptions.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="rounded-lg bg-[#F5F0EB]"><SelectValue placeholder="筛选状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="在库">在库</SelectItem>
            <SelectItem value="已用完">已用完</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {beans.length >= 20 && (search || (filterProcess && filterProcess !== "all") || (filterStatus && filterStatus !== "all")) && (
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
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base text-[#2C2825] leading-snug">
                      {bean.origin || bean.region?.country || bean.name}
                    </CardTitle>
                    {bean.score != null && (
                      <span className="text-sm font-semibold text-gradient-accent shrink-0">{bean.score}</span>
                    )}
                  </div>
                  {bean.origin && bean.region && (
                    <p className="text-xs text-[#9C9490] mt-0.5">{bean.region.country} · {bean.region.region}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5">
                  {/* Key info line */}
                  <div className="text-xs text-[#6B6560] leading-relaxed space-y-0.5">
                    {bean.variety && <p>品种：{bean.variety.name}{bean.species ? ` (${bean.species})` : ''}</p>}
                    {bean.altitude && <p>海拔：{bean.altitude}</p>}
                    {bean.process && <p>处理法：{bean.process}</p>}
                    {bean.station && <p>处理站：{bean.station}</p>}
                    {bean.producer && <p>生产者：{bean.producer}</p>}
                    {bean.purchases && bean.purchases.length > 0 && (
                      <p>库存：{bean.purchases.reduce((sum, p) => sum + p.weight, 0)}g（{bean.purchases.length}笔采购）</p>
                    )}
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {bean.status && (
                      <Badge className={`rounded-md border-0 text-[11px] font-medium ${bean.status === '在库' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {bean.status}
                      </Badge>
                    )}
                    {bean.roastLevel && <Badge className="rounded-md bg-[#EBE5DD] text-[#8B7355] border-0 text-[11px] font-medium">{bean.roastLevel}</Badge>}
                    {bean.batch && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">批次 {bean.batch}</Badge>}
                    {bean.roaster && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#9C9490] border-0 text-[11px]">{bean.roaster.name}</Badge>}
                  </div>
                  {bean.flavorNotes && (
                    <p className="text-xs text-[#9C9490] leading-relaxed italic">{bean.flavorNotes}</p>
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
