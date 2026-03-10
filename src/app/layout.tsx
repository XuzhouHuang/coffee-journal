import type { Metadata } from "next";
import { Noto_Serif_SC, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const bodyFont = Noto_Serif_SC({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
const serifFont = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Coffee Journal",
  description: "个人咖啡知识库 + 消费记录追踪器",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${bodyFont.variable} ${serifFont.variable}`}>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
