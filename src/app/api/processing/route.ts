import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createProcessingMethodSchema } from "@/lib/validations";

export async function GET() {
  try {
    const methods = await prisma.processingMethod.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(methods);
  } catch {
    return NextResponse.json({ error: "获取处理法失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createProcessingMethodSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i: { message: string }) => i.message).join(", ") }, { status: 400 });
    }
    const method = await prisma.processingMethod.create({ data: result.data });
    return NextResponse.json(method, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建处理法失败" }, { status: 500 });
  }
}
