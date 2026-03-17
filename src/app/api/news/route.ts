import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createNewsSchema = z.object({
  title: z.string().min(1),
  titleZh: z.string().min(1),
  source: z.string().min(1),
  url: z.string().url(),
  summary: z.string().optional(),
  content: z.string().optional(),
  newsDate: z.string(),
});

const batchNewsSchema = z.array(createNewsSchema);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const date = searchParams.get("date"); // YYYY-MM-DD

    const where = date ? { newsDate: new Date(date) } : {};

    const news = await prisma.coffeeNews.findMany({
      where,
      orderBy: { newsDate: "desc" },
      take: limit,
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, content } = body;
    if (!id || !content) {
      return NextResponse.json({ error: "id and content required" }, { status: 400 });
    }
    const updated = await prisma.coffeeNews.update({
      where: { id },
      data: { content },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keepDays = parseInt(searchParams.get("keepDays") || "2");

    // Calculate cutoff: keep today and (keepDays-1) days before
    const now = new Date();
    // Use UTC+8 for Beijing time
    const bjNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const bjDate = new Date(bjNow.getFullYear(), bjNow.getMonth(), bjNow.getDate());
    // Go back keepDays from start of today (Beijing)
    const cutoff = new Date(bjDate.getTime() - keepDays * 24 * 60 * 60 * 1000);
    // Convert back to UTC for DB query
    const cutoffUtc = new Date(cutoff.getTime() - 8 * 60 * 60 * 1000);

    const deleted = await prisma.coffeeNews.deleteMany({
      where: { newsDate: { lt: cutoffUtc } },
    });

    return NextResponse.json({ deleted: deleted.count, cutoff: cutoffUtc.toISOString() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both single and batch
    if (Array.isArray(body)) {
      const result = batchNewsSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error.issues.map(i => i.message).join(", ") }, { status: 400 });
      }
      const created = await prisma.coffeeNews.createMany({
        data: result.data.map(n => ({
          ...n,
          newsDate: new Date(n.newsDate),
          content: n.content || null,
        })),
      });
      return NextResponse.json({ count: created.count }, { status: 201 });
    } else {
      const result = createNewsSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error.issues.map(i => i.message).join(", ") }, { status: 400 });
      }
      const news = await prisma.coffeeNews.create({
        data: {
          ...result.data,
          newsDate: new Date(result.data.newsDate),
          content: result.data.content || null,
        },
      });
      return NextResponse.json(news, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "创建新闻失败" }, { status: 500 });
  }
}
