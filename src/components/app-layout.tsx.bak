"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coffee, Menu, ShoppingBag, Home, MapPin, Leaf, Flame, Beaker, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/beans", label: "咖啡豆", icon: Coffee },
  { href: "/purchases", label: "消费记录", icon: ShoppingBag },
];

const knowledgeItems = [
  { href: "/knowledge/regions", label: "产区", icon: MapPin },
  { href: "/knowledge/varieties", label: "品种", icon: Leaf },
  { href: "/knowledge/roasters", label: "烘焙商", icon: Flame },
  { href: "/knowledge/processing", label: "处理法", icon: Beaker },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const [knowledgeOpen, setKnowledgeOpen] = useState(true);
  const isKnowledgeActive = pathname.startsWith("/knowledge");

  const renderLink = (item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }, indent = false) => {
    const isActive = item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          indent && "ml-4 text-[13px]",
          isActive
            ? "bg-[rgba(200,168,130,0.12)] text-[#D4B896]"
            : "text-[#8A7B6E] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#C8B4A0]"
        )}
      >
        <item.icon className={cn(
          "shrink-0 transition-colors",
          indent ? "h-4 w-4" : "h-[18px] w-[18px]",
          isActive ? "text-[#C8A882]" : "text-[#6B5D50] group-hover:text-[#8A7B6E]"
        )} />
        {item.label}
        {isActive && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C8A882]" />
        )}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-0.5">
      {mainNavItems.map((item) => renderLink(item))}

      <div className="mt-6 mb-2 px-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A4D42]">知识库</span>
      </div>

      <button
        onClick={() => setKnowledgeOpen(!knowledgeOpen)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all w-full",
          isKnowledgeActive ? "text-[#C8B4A0]" : "text-[#8A7B6E] hover:text-[#C8B4A0]"
        )}
      >
        <BookOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
        <span className="flex-1 text-left">全部分类</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform text-[#6B5D50]", knowledgeOpen && "rotate-180")} />
      </button>
      {knowledgeOpen && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {knowledgeItems.map((item) => renderLink(item, true))}
        </div>
      )}
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-[rgba(255,255,255,0.05)] p-5 sticky top-0 h-screen"
        style={{ background: 'rgba(22, 18, 14, 0.85)', backdropFilter: 'blur(24px)' }}>
        <Link href="/" className="flex items-center gap-2.5 mb-8 px-3 group">
          <span className="text-xl transition-transform group-hover:rotate-12">☕</span>
          <span className="text-base font-bold text-[#D4B896] font-[family-name:var(--font-brand)] tracking-tight">Coffee Journal</span>
        </Link>
        <NavLinks />
        <div className="mt-auto pt-6 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(200,168,130,0.15)] to-transparent mb-4" />
          <p className="text-[11px] text-[#5A4D42] leading-relaxed">
            记录每一杯的味道
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-5 py-4"
          style={{ background: 'rgba(22, 18, 14, 0.9)', backdropFilter: 'blur(24px)' }}>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">☕</span>
            <span className="text-sm font-bold text-[#D4B896] font-[family-name:var(--font-brand)]">Coffee Journal</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                <Menu className="h-5 w-5 text-[#8A7B6E]" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 border-[rgba(255,255,255,0.05)]"
              style={{ background: 'rgba(22, 18, 14, 0.95)', backdropFilter: 'blur(24px)' }}>
              <div className="flex items-center gap-2 mb-8 px-3 pt-4">
                <span className="text-xl">☕</span>
                <span className="text-base font-bold text-[#D4B896] font-[family-name:var(--font-brand)]">Coffee Journal</span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-5 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
