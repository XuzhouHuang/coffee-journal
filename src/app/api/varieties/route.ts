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
    const result = createVarietySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i: { message: string }) => i.message).join(", ") }, { status: 400 });
    }
    const variety = await prisma.variety.create({ data: result.data });
    return NextResponse.json(variety, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建品种失败" }, { status: 500 });
  }
}
