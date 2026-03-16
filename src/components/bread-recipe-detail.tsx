"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Step {
  order: number;
  description: string;
}

interface Recipe {
  id: number;
  name: string;
  breadType: string | null;
  ingredients: string;
  steps: string;
  fermentation: string | null;
  bakingTemp: number | null;
  bakingTime: string | null;
  difficulty: string | null;
  tips: string | null;
  rating: number | null;
  createdAt: string;
}

interface Props {
  recipe: Recipe;
}

export function BreadRecipeDetail({ recipe }: Props) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  let ingredients: Ingredient[] = [];
  let steps: Step[] = [];
  try { ingredients = JSON.parse(recipe.ingredients); } catch {}
  try { steps = JSON.parse(recipe.steps); } catch {}

  async function handleDelete() {
    if (!confirm("确定删除这个配方吗？")) return;
    try {
      const res = await fetch(`/api/bread-recipes/${recipe.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("已删除");
        router.push("/bread/recipes");
        router.refresh();
      } else {
        toast.error("删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 pt-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg">
          <ArrowLeft className="h-5 w-5 text-[#9C9490]" />
        </Button>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Recipe</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">{recipe.name}</h1>
        </div>
        {isAdmin && (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="rounded-lg text-red-400 hover:text-red-500">
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-2">
        {recipe.breadType && <Badge variant="outline" className="rounded-md text-xs border-[#E8E2DA] text-[#9C9490]">{recipe.breadType}</Badge>}
        {recipe.difficulty && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-xs">{recipe.difficulty}</Badge>}
        {recipe.fermentation && <Badge variant="secondary" className="rounded-md bg-[#F5F0EB] text-[#9C9490] border-0 text-xs">发酵：{recipe.fermentation}</Badge>}
        {recipe.bakingTemp && <Badge variant="secondary" className="rounded-md bg-[#F5F0EB] text-[#9C9490] border-0 text-xs">{recipe.bakingTemp}°C</Badge>}
        {recipe.bakingTime && <Badge variant="secondary" className="rounded-md bg-[#F5F0EB] text-[#9C9490] border-0 text-xs">{recipe.bakingTime}</Badge>}
        {recipe.rating != null && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-xs">⭐ {recipe.rating}</Badge>}
      </div>

      {/* Ingredients table */}
      <div className="glass-card p-5">
        <h2 className="text-base font-semibold text-[#2C2825] mb-4">原料</h2>
        {ingredients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E2DA]">
                <TableHead className="text-[#B8B0A8] text-xs">原料名</TableHead>
                <TableHead className="text-[#B8B0A8] text-xs">用量</TableHead>
                <TableHead className="text-[#B8B0A8] text-xs">单位</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i} className="border-[rgba(255,255,255,0.03)]">
                  <TableCell className="text-sm text-[#2C2825]">{ing.name}</TableCell>
                  <TableCell className="text-sm text-[#6B6058]">{ing.amount}</TableCell>
                  <TableCell className="text-sm text-[#9C9490]">{ing.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-[#B8B0A8] text-sm">无原料数据</p>
        )}
      </div>

      {/* Steps */}
      <div className="glass-card p-5">
        <h2 className="text-base font-semibold text-[#2C2825] mb-4">制作步骤</h2>
        {steps.length > 0 ? (
          <ol className="space-y-3">
            {steps.sort((a, b) => a.order - b.order).map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F0ECE6] text-[#8B7355] text-xs font-medium flex items-center justify-center">
                  {step.order}
                </span>
                <p className="text-sm text-[#2C2825] leading-relaxed pt-0.5">{step.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[#B8B0A8] text-sm">无步骤数据</p>
        )}
      </div>

      {/* Tips */}
      {recipe.tips && (
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-[#2C2825] mb-3">制作心得</h2>
          <p className="text-sm text-[#6B6058] leading-relaxed whitespace-pre-wrap">{recipe.tips}</p>
        </div>
      )}

      <p className="text-[#B8B0A8] text-xs">创建于 {new Date(recipe.createdAt).toLocaleDateString("zh-CN")}</p>
    </div>
  );
}
