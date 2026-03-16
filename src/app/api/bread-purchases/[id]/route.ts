import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBreadPurchaseSchema } from "@/lib/validations";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const purchase = await prisma.breadPurchase.findUnique({ where: { id: parseInt(id, 10) } });
    if (!purchase) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(purchase);
  } catch (error) {
    console.error("GET /api/bread-purchases/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = createBreadPurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const purchase = await prisma.breadPurchase.update({
      where: { id: parseInt(id, 10) },
      data: {
        bakeryName: d.bakeryName,
        location: d.location ?? null,
        breadName: d.breadName,
        breadType: d.breadType ?? null,
        price: d.price,
        purchaseDate: new Date(d.purchaseDate),
        notes: d.notes ?? null,
      },
    });
    return NextResponse.json(purchase);
  } catch (error) {
    console.error("PUT /api/bread-purchases/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.breadPurchase.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bread-purchases/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
