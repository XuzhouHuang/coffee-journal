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
    const result = createRegionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i: { message: string }) => i.message).join(", ") }, { status: 400 });
    }
    const region = await prisma.region.create({ data: result.data });
    return NextResponse.json(region, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建产区失败" }, { status: 500 });
  }
}
