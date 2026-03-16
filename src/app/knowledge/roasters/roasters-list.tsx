"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Roaster {
  id: number;
  name: string;
  country: string;
  specialty?: string | null;
  website?: string | null;
  shopUrl?: string | null;
}

export function RoastersList({ roasters }: { roasters: Roaster[] }) {
  const [search, setSearch] = useState("");

  const filtered = roasters.filter((r) => {
    if (!search) return true;
    return r.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Input
        placeholder="搜索烘焙商名..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs rounded-lg bg-[#F5F0EB]"
      />
      {filtered.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无匹配的烘焙商数据</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roasters.length > 0 && filtered.map((r) => (
            <Card key={r.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="text-[#2C2825]">{r.name}</span>
                  <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{r.country}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 px-5 pb-5">
                {r.specialty && <p className="text-[#9C9490] text-xs">特色: {r.specialty}</p>}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#8B7355] transition-colors block truncate text-xs">
                    {r.website}
                  </a>
                )}
                {r.shopUrl && (
                  <a href={r.shopUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#8B7355] transition-colors block truncate text-xs">
                    店铺链接
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
