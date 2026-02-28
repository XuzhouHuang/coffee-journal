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
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-bold transition-all",
            isActive
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30"
              : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
          )}
        >
          <item.icon className="h-5 w-5" />
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
      <aside className="hidden md:flex w-64 flex-col bg-[rgba(10,15,26,0.7)] backdrop-blur-xl border-r border-white/[0.08] p-4">
        <Link href="/" className="flex items-center gap-2 mb-6 px-3">
          <span className="text-2xl">☕</span>
          <span className="text-lg font-bold text-foreground font-[family-name:var(--font-brand)]">Coffee Journal</span>
        </Link>
        <NavLinks />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-white/[0.05] backdrop-blur-xl border-b border-white/[0.08] p-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="font-bold text-foreground font-[family-name:var(--font-brand)]">Coffee Journal</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-[rgba(10,15,26,0.7)] backdrop-blur-xl border-white/[0.08]">
              <div className="flex items-center gap-2 mb-6 px-3 pt-4">
                <span className="text-2xl">☕</span>
                <span className="text-lg font-bold text-foreground font-[family-name:var(--font-brand)]">Coffee Journal</span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
