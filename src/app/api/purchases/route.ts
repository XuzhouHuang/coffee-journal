import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [beanPurchases, cafePurchases] = await Promise.all([
      prisma.beanPurchase.findMany({
        include: { bean: true },
        orderBy: { purchaseDate: "desc" },
      }),
      prisma.cafePurchase.findMany({
        orderBy: { purchaseDate: "desc" },
      }),
    ]);
    return NextResponse.json({ beanPurchases, cafePurchases });
  } catch (error) {
    console.error("GET /api/purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
