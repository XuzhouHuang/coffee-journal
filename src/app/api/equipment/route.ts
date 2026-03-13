import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createEquipmentSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  category: z.string().min(1, "分类不能为空"),
  brand: z.string().optional(),
  price: z.number().positive("价格必须大于0"),
  purchaseDate: z.string().min(1, "日期不能为空"),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const items = await prisma.equipmentPurchase.findMany({
      orderBy: { purchaseDate: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/equipment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createEquipmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const item = await prisma.equipmentPurchase.create({
      data: {
        name: d.name,
        category: d.category,
        brand: d.brand ?? null,
        price: d.price,
        purchaseDate: new Date(d.purchaseDate),
        source: d.source ?? null,
        notes: d.notes ?? null,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/equipment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
