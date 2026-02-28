"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function VarietyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description") || null,
      flavor: fd.get("flavor") || null,
    };
    await fetch("/api/varieties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />添加品种</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>添加品种</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><Label>品种名 *</Label><Input name="name" required /></div>
          <div><Label>描述</Label><Textarea name="description" /></div>
          <div><Label>风味</Label><Input name="flavor" /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "保存中..." : "保存"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
