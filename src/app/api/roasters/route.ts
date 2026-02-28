import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createRoasterSchema } from "@/lib/validations";

export async function GET() {
  try {
    const roasters = await prisma.roaster.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(roasters);
  } catch {
    return NextResponse.json({ error: "获取烘焙商失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createRoasterSchema.parse(body);
    const roaster = await prisma.roaster.create({ data });
    return NextResponse.json(roaster, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "数据验证失败", details: err }, { status: 400 });
    }
    return NextResponse.json({ error: "创建烘焙商失败" }, { status: 500 });
  }
}
