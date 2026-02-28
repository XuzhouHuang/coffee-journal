import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createCafePurchaseSchema } from "@/lib/validations";
import { safeParseFloat } from "@/lib/utils";

export async function GET() {
  try {
    const purchases = await prisma.cafePurchase.findMany({
      orderBy: { purchaseDate: "desc" },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("GET /api/cafe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createCafePurchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const purchase = await prisma.cafePurchase.create({
      data: {
        cafeName: d.cafeName,
        location: d.location ?? null,
        drinkName: d.drinkName,
        drinkType: d.drinkType ?? null,
        price: d.price,
        purchaseDate: new Date(d.purchaseDate),
        rating: safeParseFloat(d.rating),
        notes: d.notes ?? null,
        photo: d.photo ?? null,
      },
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST /api/cafe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
