// NOTE: This API route is kept for potential external/mobile client use.
// Currently, the web UI uses Server Components with direct Prisma access.
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [regions, varieties, roasters] = await Promise.all([
      prisma.region.findMany({ orderBy: { country: "asc" } }),
      prisma.variety.findMany({ orderBy: { name: "asc" } }),
      prisma.roaster.findMany({ orderBy: { name: "asc" } }),
    ]);
    return NextResponse.json({ regions, varieties, roasters });
  } catch (error) {
    console.error("GET /api/meta error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
