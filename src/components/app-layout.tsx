"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coffee, Menu, ShoppingBag, Home, MapPin, Leaf, Flame, Beaker, BookOpen, ChevronDown, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";

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
          "group flex items-center gap-3 px-3 py-2.5 text-base transition-all border-l-2",
          indent && "ml-4 text-sm",
          isActive
            ? "border-[#8B7355] text-[#2C2825] font-medium"
            : "border-transparent text-[#9C9490] hover:text-[#2C2825] hover:border-[#D5CEC4]"
        )}
      >
        <item.icon className={cn(
          "shrink-0 transition-colors",
          indent ? "h-4 w-4" : "h-[18px] w-[18px]",
          isActive ? "text-[#8B7355]" : "text-[#B8B0A8] group-hover:text-[#9C9490]"
        )} />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-0.5">
      {mainNavItems.map((item) => renderLink(item))}

      <div className="mt-8 mb-3 px-3">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-[#B8B0A8]">Knowledge</span>
      </div>

      <button
        onClick={() => setKnowledgeOpen(!knowledgeOpen)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-base transition-all w-full border-l-2 border-transparent",
          isKnowledgeActive ? "text-[#2C2825]" : "text-[#9C9490] hover:text-[#2C2825]"
        )}
      >
        <BookOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
        <span className="flex-1 text-left">全部分类</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform text-[#B8B0A8]", knowledgeOpen && "rotate-180")} />
      </button>
      {knowledgeOpen && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {knowledgeItems.map((item) => renderLink(item, true))}
        </div>
      )}
    </nav>
  );
}

function AuthButton() {
  const { isAdmin, logout } = useAuth();

  if (isAdmin) {
    return (
      <button
        onClick={() => {
          logout();
          // Also clear Easy Auth session
          window.location.href = "/.auth/logout?post_logout_redirect_uri=/";
        }}
        className="flex items-center gap-2 text-xs text-[#9C9490] hover:text-[#2C2825] transition-colors"
      >
        <LogOut className="h-3 w-3" />
        <span>退出管理</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        window.location.href = "/.auth/login/aad?post_login_redirect_uri=" + encodeURIComponent(window.location.pathname);
      }}
      className="flex items-center gap-2 text-xs text-[#9C9490] hover:text-[#2C2825] transition-colors"
    >
      <LogIn className="h-3 w-3" />
      <span>管理员登录</span>
    </button>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-[#FAF8F5] border-r border-[#E8E2DA] p-6 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2.5 mb-10 px-3 group">
          <span className="text-lg transition-transform group-hover:rotate-12">☕</span>
          <span className="text-lg font-normal text-[#2C2825]" style={{ fontFamily: 'var(--font-serif), serif' }}>
            Coffee Journal
          </span>
        </Link>
        <NavLinks />
        <div className="mt-auto pt-8 px-3">
          <div className="h-px bg-[#E8E2DA] mb-4" />
          <AuthButton />
          <p className="text-[10px] text-[#B8B0A8] leading-relaxed tracking-wider uppercase mt-3">
            Est. 2026
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-lg border-b border-[#E8E2DA] px-5 py-4 sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">☕</span>
            <span className="text-base text-[#2C2825]" style={{ fontFamily: 'var(--font-serif), serif' }}>
              Coffee Journal
            </span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                <Menu className="h-5 w-5 text-[#9C9490]" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 bg-[#FAF8F5] border-[#E8E2DA]">
              <div className="flex items-center gap-2 mb-10 px-3 pt-4">
                <span className="text-lg">☕</span>
                <span className="text-base text-[#2C2825]" style={{ fontFamily: 'var(--font-serif), serif' }}>
                  Coffee Journal
                </span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-14">{children}</main>
      </div>
    </div>
  );
}
