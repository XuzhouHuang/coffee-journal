import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBreadPurchaseSchema } from "@/lib/validations";

export async function GET() {
  try {
    const purchases = await prisma.breadPurchase.findMany({
      orderBy: { purchaseDate: "desc" },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("GET /api/bread-purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createBreadPurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const purchase = await prisma.breadPurchase.create({
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
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST /api/bread-purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
