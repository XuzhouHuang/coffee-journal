"use client";

import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  titleZh: string;
  source: string;
  url: string;
  summary?: string | null;
  newsDate: string;
}

const sourceColors: Record<string, string> = {
  "Daily Coffee News": "bg-[#E8D5C4] text-[#8B5E3C]",
  "Perfect Daily Grind": "bg-[#D4E8D4] text-[#3C6B3C]",
  "Sprudge": "bg-[#D4D8E8] text-[#3C4A6B]",
  "Coffee Review": "bg-[#E8E4D4] text-[#6B5E3C]",
};

export function CoffeeNewsList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <p className="text-[#B8B0A8] text-center py-8 text-sm">暂无咖啡新闻</p>
    );
  }

  return (
    <div className="space-y-2">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/news/${item.id}`}
          className="block group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2 px-1 hover:bg-[#FAF8F5] transition-colors rounded-md">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 w-fit ${sourceColors[item.source] || "bg-[#F0ECE6] text-[#9C9490]"}`}>
              {item.source}
            </span>
            <p className="text-[#2C2825] text-sm leading-snug group-hover:text-[#8B7355] transition-colors line-clamp-2 sm:truncate">
              {item.titleZh}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
