import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBeanPurchaseSchema } from "@/lib/validations";
import { safeParseInt } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beanId = safeParseInt(id);
    if (beanId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json();
    const result = createBeanPurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const purchase = await prisma.beanPurchase.create({
      data: {
        beanId,
        price: d.price,
        weight: d.weight,
        purchaseDate: new Date(d.purchaseDate),
        source: d.source ?? null,
        notes: d.notes ?? null,
      },
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans/[id]/purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
