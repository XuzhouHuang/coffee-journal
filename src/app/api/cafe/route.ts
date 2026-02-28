import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const purchases = await prisma.cafePurchase.findMany({
    orderBy: { purchaseDate: "desc" },
  });
  return NextResponse.json(purchases);
}

export async function POST(req: NextRequest) {
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
}
