import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const brewLog = await prisma.brewLog.create({
      data: {
        beanId: parseInt(id),
        brewMethod: body.brewMethod,
        dose: body.dose ? parseFloat(body.dose) : null,
        waterAmount: body.waterAmount ? parseFloat(body.waterAmount) : null,
        ratio: body.ratio || null,
        grindSize: body.grindSize || null,
        waterTemp: body.waterTemp ? parseInt(body.waterTemp) : null,
        brewTime: body.brewTime || null,
        rating: body.rating ? parseFloat(body.rating) : null,
        notes: body.notes || null,
        brewDate: new Date(body.brewDate),
      },
    });
    return NextResponse.json(brewLog, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans/[id]/brew-logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
