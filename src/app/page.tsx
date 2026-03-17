import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroIcons } from "@/components/hero-icons";
import { CoffeeNewsList } from "@/components/coffee-news-list";

export const dynamic = "force-dynamic";

function getBeijingDate(offset = 0) {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  bj.setUTCDate(bj.getUTCDate() + offset);
  return `${bj.getUTCFullYear()}-${String(bj.getUTCMonth() + 1).padStart(2, "0")}-${String(bj.getUTCDate()).padStart(2, "0")}`;
}

export default async function HomePage() {
  // Get news from today and yesterday (Beijing time)
  const today = getBeijingDate(0);
  const yesterday = getBeijingDate(-1);

  const allNews = await prisma.coffeeNews.findMany({
    orderBy: { newsDate: "desc" },
    take: 30,
  });

  // Group by date string (Beijing time)
  const todayNews = allNews.filter((n) => {
    const d = new Date(n.newsDate.getTime() + 8 * 60 * 60 * 1000);
    const ds = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    return ds === today;
  });

  const yesterdayNews = allNews.filter((n) => {
    const d = new Date(n.newsDate.getTime() + 8 * 60 * 60 * 1000);
    const ds = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    return ds === yesterday;
  });

  const serialize = (items: typeof allNews) =>
    items.map((n: any) => ({ ...n, newsDate: n.newsDate.toISOString() }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="pt-8 pb-2 animate-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gradient-warm font-[family-name:var(--font-brand)] tracking-tight leading-[1.1]"
                style={{ fontSize: 'var(--font-display)' }}>
              咖啡，面包，好天气
            </h1>
            <p className="text-[#9C9490] mt-3 text-sm tracking-wide">记录每一天的好味道</p>
          </div>
          <HeroIcons />
        </div>
      </div>

      {/* Today's News */}
      {todayNews.length > 0 && (
        <Card className="glass-card border-0 animate-in-up delay-1 overflow-hidden">
          <CardHeader className="pb-1 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">☕ 今日咖啡</CardTitle>
              <span className="text-[11px] text-[#B8B0A8]">{today}</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <CoffeeNewsList news={serialize(todayNews)} />
          </CardContent>
        </Card>
      )}

      {/* Yesterday's News */}
      {yesterdayNews.length > 0 && (
        <Card className="glass-card border-0 animate-in-up delay-2 overflow-hidden">
          <CardHeader className="pb-1 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">📰 昨日咖啡</CardTitle>
              <span className="text-[11px] text-[#B8B0A8]">{yesterday}</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <CoffeeNewsList news={serialize(yesterdayNews)} />
          </CardContent>
        </Card>
      )}

      {/* Fallback: if no today/yesterday news, show latest */}
      {todayNews.length === 0 && yesterdayNews.length === 0 && allNews.length > 0 && (
        <Card className="glass-card border-0 animate-in-up delay-1 overflow-hidden">
          <CardHeader className="pb-1 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#6B6058]">☕ 咖啡日报</CardTitle>
              <span className="text-[11px] text-[#B8B0A8]">
                {new Date(allNews[0].newsDate).toLocaleDateString("zh-CN")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <CoffeeNewsList news={serialize(allNews.slice(0, 10))} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
