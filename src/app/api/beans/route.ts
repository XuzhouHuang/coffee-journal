import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regionId = searchParams.get("regionId");
    const varietyId = searchParams.get("varietyId");
    const roasterId = searchParams.get("roasterId");

    const where: Record<string, unknown> = {};
    if (regionId) where.regionId = parseInt(regionId);
    if (varietyId) where.varietyId = parseInt(varietyId);
    if (roasterId) where.roasterId = parseInt(roasterId);

    const beans = await prisma.bean.findMany({
      where,
      include: { roaster: true, region: true, variety: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(beans);
  } catch (error) {
    console.error("GET /api/beans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bean = await prisma.bean.create({
      data: {
        name: body.name,
        roasterId: body.roasterId || null,
        regionId: body.regionId || null,
        varietyId: body.varietyId || null,
        process: body.process || null,
        roastLevel: body.roastLevel || null,
        flavorNotes: body.flavorNotes || null,
        score: body.score ? parseFloat(body.score) : null,
      },
      include: { roaster: true, region: true, variety: true },
    });
    return NextResponse.json(bean, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
