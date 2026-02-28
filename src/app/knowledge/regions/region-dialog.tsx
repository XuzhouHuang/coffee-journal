"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function RegionDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      country: fd.get("country"),
      region: fd.get("region"),
      subRegion: fd.get("subRegion") || null,
      altitude: fd.get("altitude") || null,
      climate: fd.get("climate") || null,
      notes: fd.get("notes") || null,
    };
    await fetch("/api/regions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />添加产区</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>添加产区</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><Label>国家 *</Label><Input name="country" required /></div>
          <div><Label>产区 *</Label><Input name="region" required /></div>
          <div><Label>子产区</Label><Input name="subRegion" /></div>
          <div><Label>海拔</Label><Input name="altitude" /></div>
          <div><Label>气候</Label><Input name="climate" /></div>
          <div><Label>备注</Label><Textarea name="notes" /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "保存中..." : "保存"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
