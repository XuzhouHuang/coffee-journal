import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBrewLogSchema } from "@/lib/validations";
import { safeParseInt, safeParseFloat } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beanId = safeParseInt(id);
    if (beanId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json();
    const result = createBrewLogSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const brewLog = await prisma.brewLog.create({
      data: {
        beanId,
        brewMethod: d.brewMethod,
        dose: safeParseFloat(d.dose),
        waterAmount: safeParseFloat(d.waterAmount),
        ratio: d.ratio ?? null,
        grindSize: d.grindSize ?? null,
        waterTemp: safeParseInt(typeof d.waterTemp === 'number' ? String(d.waterTemp) : d.waterTemp),
        brewTime: d.brewTime ?? null,
        rating: safeParseFloat(d.rating),
        notes: d.notes ?? null,
        brewDate: new Date(d.brewDate),
      },
    });
    return NextResponse.json(brewLog, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans/[id]/brew-logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
