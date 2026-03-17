import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CountryDetailPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country);

  const regions = await prisma.region.findMany({
    where: { country: decodedCountry },
    orderBy: { region: "asc" },
  });

  if (regions.length === 0) {
    notFound();
  }

  // Country code mapping for flag images
  const countryCodes: Record<string, string> = {
    "Panama": "pa", "Ethiopia": "et", "Kenya": "ke", "Colombia": "co",
    "Brazil": "br", "Indonesia": "id", "Hawaii (USA)": "us", "Costa Rica": "cr",
    "Guatemala": "gt", "Yemen": "ye", "Rwanda": "rw", "China": "cn",
    "Peru": "pe", "Mexico": "mx", "El Salvador": "sv", "Honduras": "hn",
    "Vietnam": "vn", "India": "in", "Tanzania": "tz", "Jamaica": "jm",
  };
  const code = countryCodes[decodedCountry];
  const flagImg = code
    ? `https://flagcdn.com/w80/${code}.png`
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pt-4">
        <Link href="/knowledge/regions" className="inline-flex items-center gap-1 text-[#9C9490] hover:text-[#8B7355] text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回产区
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Origin</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight flex items-center gap-3">
            {flagImg ? (
              <img src={flagImg} alt={decodedCountry} width={32} height={24} className="rounded-sm object-cover" style={{ width: 32, height: 24 }} />
            ) : (
              <span className="text-3xl">🌍</span>
            )}
            {decodedCountry}
          </h1>
          <p className="text-[#9C9490] text-sm mt-1">{regions.length} 个产区</p>
        </div>
      </div>

      {/* Region cards */}
      <div className="space-y-4">
        {regions.map((r) => (
          <Card key={r.id} className="glass-card border-0">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="text-lg text-[#2C2825] flex items-center gap-2">
                {r.region}
                {r.subRegion && (
                  <span className="text-sm font-normal text-[#9C9490]">/ {r.subRegion}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {r.altitude && (
                  <Badge variant="outline" className="rounded-md text-xs border-[#E8E2DA] text-[#9C9490]">
                    🏔️ 海拔 {r.altitude}
                  </Badge>
                )}
                {r.climate && (
                  <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-xs">
                    🌤️ {r.climate}
                  </Badge>
                )}
              </div>
              {r.notes && (
                <p className="text-[#6B6560] text-sm leading-relaxed whitespace-pre-wrap">{r.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
