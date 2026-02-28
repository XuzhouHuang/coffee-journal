"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const brewMethods = ["手冲", "摩卡壶", "法压壶", "爱乐压", "意式浓缩", "冷萃", "虹吸壶", "土耳其壶", "其他"];

export default function BrewLogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [method, setMethod] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    data.brewMethod = method;

    const res = await fetch(`/api/beans/${id}/brew-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("冲煮记录添加成功！");
      router.push(`/beans/${id}`);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href={`/beans/${id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">添加冲煮记录</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>冲煮方式 *</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger><SelectValue placeholder="选择冲煮方式" /></SelectTrigger>
                <SelectContent>
                  {brewMethods.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>冲煮日期 *</Label>
              <Input name="brewDate" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>粉量 (g)</Label><Input name="dose" type="number" step="0.1" /></div>
              <div><Label>水量 (ml)</Label><Input name="waterAmount" type="number" step="1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>粉水比</Label><Input name="ratio" placeholder="1:15" /></div>
              <div><Label>研磨度</Label><Input name="grindSize" placeholder="中细" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>水温 (°C)</Label><Input name="waterTemp" type="number" /></div>
              <div><Label>冲煮时间</Label><Input name="brewTime" placeholder="2:30" /></div>
            </div>
            <div>
              <Label>评分 (1-5)</Label>
              <Input name="rating" type="number" step="0.5" min="1" max="5" />
            </div>
            <div>
              <Label>品鉴笔记</Label>
              <Textarea name="notes" placeholder="今天这杯的风味..." rows={3} />
            </div>
            <Button type="submit" className="w-full">保存冲煮记录</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
