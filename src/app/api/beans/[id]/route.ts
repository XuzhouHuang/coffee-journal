import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bean = await prisma.bean.findUnique({
      where: { id: parseInt(id) },
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
    const body = await req.json();
    const bean = await prisma.bean.update({
      where: { id: parseInt(id) },
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
    await prisma.bean.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/beans/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
