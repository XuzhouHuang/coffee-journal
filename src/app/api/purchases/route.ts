import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { safeParseInt } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, safeParseInt(searchParams.get("page")) ?? 1);
    const limit = Math.min(100, Math.max(1, safeParseInt(searchParams.get("limit")) ?? 20));

    const [beanPurchases, beanTotal, cafePurchases, cafeTotal] = await Promise.all([
      prisma.beanPurchase.findMany({
        include: { bean: true },
        orderBy: { purchaseDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.beanPurchase.count(),
      prisma.cafePurchase.findMany({
        orderBy: { purchaseDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cafePurchase.count(),
    ]);
    return NextResponse.json({
      beanPurchases: { data: beanPurchases, total: beanTotal, page, limit },
      cafePurchases: { data: cafePurchases, total: cafeTotal, page, limit },
    });
  } catch (error) {
    console.error("GET /api/purchases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
