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
    const result = createRoasterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i: { message: string }) => i.message).join(", ") }, { status: 400 });
    }
    const roaster = await prisma.roaster.create({ data: result.data });
    return NextResponse.json(roaster, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建烘焙商失败" }, { status: 500 });
  }
}
