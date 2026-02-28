import type { Metadata } from "next";
import { LXGW_WenKai_TC } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";

const brandFont = LXGW_WenKai_TC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "Coffee Journal",
  description: "个人咖啡知识库 + 消费记录追踪器",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={brandFont.variable}>
      <body className="antialiased min-h-screen">
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
