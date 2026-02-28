import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
}
