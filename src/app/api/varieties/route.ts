import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createVarietySchema } from "@/lib/validations";

export async function GET() {
  try {
    const varieties = await prisma.variety.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(varieties);
  } catch {
    return NextResponse.json({ error: "获取品种失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createVarietySchema.parse(body);
    const variety = await prisma.variety.create({ data });
    return NextResponse.json(variety, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "数据验证失败", details: err }, { status: 400 });
    }
    return NextResponse.json({ error: "创建品种失败" }, { status: 500 });
  }
}
