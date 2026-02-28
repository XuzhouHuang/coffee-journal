import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    const purchase = await prisma.cafePurchase.create({
      data: {
        cafeName: body.cafeName,
        location: body.location || null,
        drinkName: body.drinkName,
        drinkType: body.drinkType || null,
        price: parseFloat(body.price),
        purchaseDate: new Date(body.purchaseDate),
        rating: body.rating ? parseFloat(body.rating) : null,
        notes: body.notes || null,
        photo: body.photo || null,
      },
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST /api/cafe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
