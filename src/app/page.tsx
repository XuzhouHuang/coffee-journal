import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">欢迎来到咖啡日志 ☕</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/beans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-2">
              <Coffee className="h-5 w-5" />
              <CardTitle>咖啡豆</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">管理你的咖啡豆、购买记录和冲煮日志</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/purchases">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <CardTitle>消费记录</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">记录豆子购买和咖啡店消费</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
