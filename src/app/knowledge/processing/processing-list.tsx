"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ProcessingMethod {
  id: number;
  name: string;
  description?: string | null;
  flavorNotes?: string | null;
  suitable?: string | null;
}

export function ProcessingList({ methods }: { methods: ProcessingMethod[] }) {
  const [search, setSearch] = useState("");

  const filtered = methods.filter((m) => {
    if (!search) return true;
    return m.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Input
        placeholder="搜索处理法名..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs rounded-lg bg-[#F5F0EB]"
      />
      {filtered.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无匹配的处理法数据</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#2C2825]">{m.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 px-5 pb-5">
                {m.description && <p className="text-[#9C9490] text-xs leading-relaxed">{m.description}</p>}
                {m.flavorNotes && (
                  <div>
                    <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px] mb-1.5">风味特点</Badge>
                    <p className="text-[#B8B0A8] text-xs">{m.flavorNotes}</p>
                  </div>
                )}
                {m.suitable && (
                  <div>
                    <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">适合场景</Badge>
                    <p className="text-[#B8B0A8] text-xs mt-1">{m.suitable}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
