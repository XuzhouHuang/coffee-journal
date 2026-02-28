"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function RoasterDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      country: fd.get("country"),
      specialty: fd.get("specialty") || null,
      website: fd.get("website") || null,
      shopUrl: fd.get("shopUrl") || null,
      notes: fd.get("notes") || null,
    };
    await fetch("/api/roasters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />添加烘焙商</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>添加烘焙商</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><Label>名称 *</Label><Input name="name" required /></div>
          <div><Label>国家 *</Label><Input name="country" required /></div>
          <div><Label>特色</Label><Input name="specialty" /></div>
          <div><Label>网站</Label><Input name="website" /></div>
          <div><Label>店铺链接</Label><Input name="shopUrl" /></div>
          <div><Label>备注</Label><Textarea name="notes" /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "保存中..." : "保存"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
