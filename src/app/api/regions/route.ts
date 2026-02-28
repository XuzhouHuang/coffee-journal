import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createRegionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const regions = await prisma.region.findMany({ orderBy: { country: "asc" } });
    return NextResponse.json(regions);
  } catch {
    return NextResponse.json({ error: "获取产区失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createRegionSchema.parse(body);
    const region = await prisma.region.create({ data });
    return NextResponse.json(region, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "数据验证失败", details: err }, { status: 400 });
    }
    return NextResponse.json({ error: "创建产区失败" }, { status: 500 });
  }
}
