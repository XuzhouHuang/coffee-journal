"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Variety {
  id: number;
  name: string;
  description?: string | null;
  flavor?: string | null;
}

export function VarietiesList({ varieties }: { varieties: Variety[] }) {
  const [search, setSearch] = useState("");

  const filtered = varieties.filter((v) => {
    if (!search) return true;
    return v.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Input
        placeholder="搜索品种名..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs rounded-lg bg-[#F5F0EB]"
      />
      {filtered.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无匹配的品种数据</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Card key={v.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#2C2825]">{v.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 px-5 pb-5">
                {v.description && <p className="text-[#9C9490] text-xs leading-relaxed">{v.description}</p>}
                {v.flavor && <p className="text-[#B8B0A8] text-xs">风味: {v.flavor}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
