"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Region {
  id: number;
  country: string;
  region: string;
  subRegion?: string | null;
  altitude?: string | null;
  climate?: string | null;
  notes?: string | null;
}

export function RegionsList({ regions }: { regions: Region[] }) {
  const [search, setSearch] = useState("");

  const filtered = regions.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.country.toLowerCase().includes(s) || r.region.toLowerCase().includes(s) || (r.subRegion && r.subRegion.toLowerCase().includes(s));
  });

  return (
    <>
      <Input
        placeholder="搜索国家/产区..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs rounded-lg bg-[#F5F0EB]"
      />
      {filtered.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无匹配的产区数据</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card key={r.id} className="glass-card-interactive border-0">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base text-[#2C2825]">{r.country} · {r.region}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 px-5 pb-5">
                {r.subRegion && <p className="text-[#9C9490] text-xs">子产区: {r.subRegion}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {r.altitude && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">海拔 {r.altitude}</Badge>}
                  {r.climate && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">{r.climate}</Badge>}
                </div>
                {r.notes && <p className="text-[#B8B0A8] text-xs leading-relaxed">{r.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
