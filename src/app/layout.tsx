import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "咖啡日志",
  description: "个人咖啡知识库 + 消费记录追踪器",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
