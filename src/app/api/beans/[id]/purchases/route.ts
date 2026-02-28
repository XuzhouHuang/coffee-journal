import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const purchase = await prisma.beanPurchase.create({
      data: {
        beanId: parseInt(id),
        price: parseFloat(body.price),
        weight: parseInt(body.weight),
        purchaseDate: new Date(body.purchaseDate),
        source: body.source || null,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST /api/beans/[id]/purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
