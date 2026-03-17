import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const sourceColors: Record<string, string> = {
  "Daily Coffee News": "bg-[#E8D5C4] text-[#8B5E3C]",
  "Perfect Daily Grind": "bg-[#D4E8D4] text-[#3C6B3C]",
  "Sprudge": "bg-[#D4D8E8] text-[#3C4A6B]",
  "Coffee Review": "bg-[#E8E4D4] text-[#6B5E3C]",
};

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsId = parseInt(id);
  if (isNaN(newsId)) notFound();

  const news = await prisma.coffeeNews.findUnique({ where: { id: newsId } });
  if (!news) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-1">
      {/* Back + Source link */}
      <div className="pt-2 sm:pt-4 flex items-center justify-between gap-2">
        <Link href="/" className="inline-flex items-center gap-1 text-[#9C9490] hover:text-[#8B7355] text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#8B7355] hover:text-[#6B5535] transition-colors border border-[#E8E2DA] rounded-lg px-3 py-1.5 hover:bg-[#FAF8F5]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          阅读原文
        </a>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${sourceColors[news.source] || "bg-[#F0ECE6] text-[#9C9490]"}`}>
            {news.source}
          </span>
          <span className="text-[#B8B0A8] text-xs">
            {new Date(news.newsDate).toLocaleDateString("zh-CN")}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#2C2825] leading-relaxed tracking-tight">
          {news.titleZh}
        </h1>
        <p className="text-[#9C9490] text-sm">{news.title}</p>
      </div>

      <div className="h-px bg-[#E8E2DA]" />

      {/* Content */}
      {news.content ? (
        <article className="prose-coffee text-[#4A4543] text-[15px] leading-[1.9] space-y-4 pb-12 whitespace-pre-wrap">
          {news.content}
        </article>
      ) : (
        <div className="text-center py-16 space-y-4">
          <p className="text-[#B8B0A8] text-sm">翻译内容即将上线</p>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#8B7355] hover:text-[#6B5535] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            前往原文阅读
          </a>
        </div>
      )}
    </div>
  );
}
