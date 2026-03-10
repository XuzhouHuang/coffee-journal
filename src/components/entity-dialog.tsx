"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/use-is-admin";

export interface EntityField {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "url";
  placeholder?: string;
}

interface EntityDialogProps {
  title: string;
  buttonLabel: string;
  apiEndpoint: string;
  fields: EntityField[];
}

export function EntityDialog({ title, buttonLabel, apiEndpoint, fields }: EntityDialogProps) {
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | null> = {};
    for (const f of fields) {
      const val = fd.get(f.name) as string;
      body[f.name] = val || null;
    }
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "请求失败" }));
        toast.error(err.error || "添加失败");
        setLoading(false);
        return;
      }
      toast.success("添加成功！");
      setOpen(false);
      setFormKey((k) => k + 1);
      router.refresh();
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setFormKey((k) => k + 1); }}>
      <DialogTrigger asChild>
        <Button className="gradient-btn"><Plus className="h-4 w-4 mr-2" />{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="glass-card">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form key={formKey} onSubmit={onSubmit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.name}>
              <Label>{f.label}{f.required ? " *" : ""}</Label>
              {f.type === "textarea" ? (
                <Textarea name={f.name} required={f.required} placeholder={f.placeholder} className="rounded-lg bg-[#F5F0EB]" />
              ) : (
                <Input name={f.name} required={f.required} placeholder={f.placeholder} type={f.type === "url" ? "url" : "text"} className="rounded-lg bg-[#F5F0EB]" />
              )}
            </div>
          ))}
          <Button type="submit" disabled={loading} className="w-full gradient-btn">
            {loading ? "保存中..." : "保存"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
