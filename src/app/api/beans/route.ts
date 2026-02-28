import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBeanSchema } from "@/lib/validations";
import { safeParseInt, safeParseFloat } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regionId = safeParseInt(searchParams.get("regionId"));
    const varietyId = safeParseInt(searchParams.get("varietyId"));
    const roasterId = safeParseInt(searchParams.get("roasterId"));
    const page = Math.max(1, safeParseInt(searchParams.get("page")) ?? 1);
    const limit = Math.min(100, Math.max(1, safeParseInt(searchParams.get("limit")) ?? 20));

    const where: Record<string, unknown> = {};
    if (regionId !== null) where.regionId = regionId;
    if (varietyId !== null) where.varietyId = varietyId;
    if (roasterId !== null) where.roasterId = roasterId;

    const [data, total] = await Promise.all([
      prisma.bean.findMany({
        where,
        include: { roaster: true, region: true, variety: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bean.count({ where }),
    ]);
    return NextResponse.json({ data, total, page, limit });
  } catch (error) {
    console.error("GET /api/beans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createBeanSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const bean = await prisma.bean.create({
      data: {
        name: d.name,
        roasterId: d.roasterId ?? null,
        regionId: d.regionId ?? null,
        varietyId: d.varietyId ?? null,
        process: d.process ?? null,
        roastLevel: d.roastLevel ?? null,
        flavorNotes: d.flavorNotes ?? null,
        score: safeParseFloat(d.score),
      },
      include: { roaster: true, region: true, variety: true },
    });
    return NextResponse.json(bean, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
