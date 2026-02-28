"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coffee, Menu, ShoppingBag, Home, MapPin, Leaf, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/beans", label: "咖啡豆", icon: Coffee },
  { href: "/purchases", label: "消费记录", icon: ShoppingBag },
  { href: "/knowledge/regions", label: "产区", icon: MapPin },
  { href: "/knowledge/varieties", label: "品种", icon: Leaf },
  { href: "/knowledge/roasters", label: "烘焙商", icon: Flame },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive = item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);
        return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
            isActive
              ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-medium shadow-md shadow-teal-500/20"
              : "text-muted-foreground hover:bg-teal-50/60 hover:text-foreground dark:hover:bg-white/5"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-white/40 dark:bg-white/5 backdrop-blur-xl border-r border-white/20 p-4">
        <Link href="/" className="flex items-center gap-2 mb-6 px-3">
          <span className="text-2xl">☕</span>
          <span className="text-lg font-bold text-foreground font-[family-name:var(--font-brand)]">咖啡日志</span>
        </Link>
        <NavLinks />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-white/40 dark:bg-white/5 backdrop-blur-xl border-b border-white/20 p-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="font-bold text-foreground font-[family-name:var(--font-brand)]">咖啡日志</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/20">
              <div className="flex items-center gap-2 mb-6 px-3 pt-4">
                <span className="text-2xl">☕</span>
                <span className="text-lg font-bold text-foreground font-[family-name:var(--font-brand)]">咖啡日志</span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
