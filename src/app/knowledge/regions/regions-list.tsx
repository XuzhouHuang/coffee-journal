"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Region {
  id: number;
  country: string;
  region: string;
  subRegion?: string | null;
  altitude?: string | null;
  climate?: string | null;
  notes?: string | null;
}

// Country code mapping for flag images
const countryCodes: Record<string, string> = {
  "Panama": "pa", "Ethiopia": "et", "Kenya": "ke", "Colombia": "co",
  "Brazil": "br", "Indonesia": "id", "Hawaii (USA)": "us", "Costa Rica": "cr",
  "Guatemala": "gt", "Yemen": "ye", "Rwanda": "rw", "Burundi": "bi",
  "Peru": "pe", "Mexico": "mx", "Bolivia": "bo", "El Salvador": "sv",
  "Honduras": "hn", "Vietnam": "vn", "India": "in", "Tanzania": "tz",
  "Uganda": "ug", "China": "cn", "Thailand": "th", "Papua New Guinea": "pg",
  "Jamaica": "jm", "Myanmar": "mm", "Laos": "la", "Philippines": "ph",
  "Taiwan": "tw", "Japan": "jp",
};

function CountryFlag({ country, size = 20 }: { country: string; size?: number }) {
  const code = countryCodes[country];
  if (!code) return <span className="text-lg">🌍</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={country}
      width={size}
      height={Math.round(size * 0.75)}
      className="inline-block rounded-sm object-cover"
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}

export function RegionsList({ regions }: { regions: Region[] }) {
  const [search, setSearch] = useState("");

  // Group by country
  const grouped = useMemo(() => {
    const map = new Map<string, Region[]>();
    for (const r of regions) {
      const list = map.get(r.country) || [];
      list.push(r);
      map.set(r.country, list);
    }
    return Array.from(map.entries()).map(([country, items]) => ({
      country,
      regions: items,
      regionCount: items.length,
      // Collect unique altitudes for summary
      altitudes: items.map(i => i.altitude).filter(Boolean) as string[],
    }));
  }, [regions]);

  const filtered = grouped.filter((g) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      g.country.toLowerCase().includes(s) ||
      g.regions.some(r =>
        r.region.toLowerCase().includes(s) ||
        (r.subRegion && r.subRegion.toLowerCase().includes(s))
      )
    );
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
          {filtered.map((g) => (
            <Link key={g.country} href={`/knowledge/regions/${encodeURIComponent(g.country)}`}>
              <Card className="glass-card-interactive border-0 cursor-pointer hover:shadow-md transition-shadow group">
                <CardHeader className="pb-2 px-5 pt-5">
                  <CardTitle className="text-base text-[#2C2825] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CountryFlag country={g.country} />
                      {g.country}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#B8B0A8] group-hover:text-[#8B7355] transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 px-5 pb-5">
                  <p className="text-[#9C9490] text-xs">
                    主要产区：{g.regions.map(r => r.region).join("、")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">
                      {g.regionCount} 个产区
                    </Badge>
                    {g.altitudes.length > 0 && (
                      <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">
                        海拔 {g.altitudes[0]}
                      </Badge>
                    )}
                  </div>
                  {/* Show first region's notes as preview */}
                  {g.regions[0]?.notes && (
                    <p className="text-[#B8B0A8] text-xs leading-relaxed line-clamp-2">{g.regions[0].notes}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
