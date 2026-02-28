"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { todayLocal } from "@/lib/utils";

export default function NewCafePurchasePage() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "请求失败" }));
        toast.error(err.error || "添加失败");
        return;
      }
      toast.success("咖啡店消费记录添加成功！");
      router.push("/purchases");
    } catch {
      toast.error("网络错误，请重试");
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/purchases">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">添加咖啡店消费</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>店名 *</Label>
              <Input name="cafeName" required placeholder="咖啡店名称" />
            </div>
            <div>
              <Label>城市/地址</Label>
              <Input name="location" placeholder="上海/北京..." />
            </div>
            <div>
              <Label>饮品名 *</Label>
              <Input name="drinkName" required placeholder="拿铁/手冲..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>饮品类型</Label>
                <Input name="drinkType" placeholder="手冲/拿铁/美式..." />
              </div>
              <div>
                <Label>价格 (元) *</Label>
                <Input name="price" type="number" step="0.01" required />
              </div>
            </div>
            <div>
              <Label>日期 *</Label>
              <Input name="purchaseDate" type="date" required defaultValue={todayLocal()} />
            </div>
            <div>
              <Label>评分 (1-5)</Label>
              <Input name="rating" type="number" step="0.5" min="1" max="5" />
            </div>
            <div>
              <Label>备注</Label>
              <Textarea name="notes" placeholder="口感、环境..." rows={3} />
            </div>
            <Button type="submit" className="w-full">保存</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
