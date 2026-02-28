import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateBeanSchema } from "@/lib/validations";
import { safeParseInt, safeParseFloat } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beanId = safeParseInt(id);
    if (beanId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const bean = await prisma.bean.findUnique({
      where: { id: beanId },
      include: {
        roaster: true,
        region: true,
        variety: true,
        purchases: { orderBy: { purchaseDate: "desc" } },
        brewLogs: { orderBy: { brewDate: "desc" } },
      },
    });
    if (!bean) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(bean);
  } catch (error) {
    console.error("GET /api/beans/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beanId = safeParseInt(id);
    if (beanId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json();
    const result = updateBeanSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const bean = await prisma.bean.update({
      where: { id: beanId },
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
    });
    return NextResponse.json(bean);
  } catch (error) {
    console.error("PUT /api/beans/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beanId = safeParseInt(id);
    if (beanId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await prisma.bean.delete({ where: { id: beanId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/beans/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
