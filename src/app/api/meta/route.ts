import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [regions, varieties, roasters] = await Promise.all([
    prisma.region.findMany({ orderBy: { country: "asc" } }),
    prisma.variety.findMany({ orderBy: { name: "asc" } }),
    prisma.roaster.findMany({ orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ regions, varieties, roasters });
}
