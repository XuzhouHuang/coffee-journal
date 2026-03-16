"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntityDialog } from "@/components/entity-dialog";

interface BreadRecipe {
  id: number;
  name: string;
  breadType: string | null;
  difficulty: string | null;
  fermentation: string | null;
  bakingTemp: number | null;
  bakingTime: string | null;
  rating: number | null;
  ingredients: string;
  steps: string;
}

interface Props {
  initialRecipes: BreadRecipe[];
}

const breadRecipeFields = [
  { name: "name", label: "配方名", required: true, placeholder: "例：经典法棍" },
  { name: "breadType", label: "面包类型", placeholder: "吐司/法棍/可颂/贝果/欧包/其他" },
  { name: "ingredients", label: "原料 (JSON)", required: true, type: "textarea" as const, placeholder: '[{"name":"高筋面粉","amount":"500","unit":"g"}]' },
  { name: "steps", label: "步骤 (JSON)", required: true, type: "textarea" as const, placeholder: '[{"order":1,"description":"混合干性材料"}]' },
  { name: "fermentation", label: "发酵方式", placeholder: "例：室温发酵 / 冷藏发酵" },
  { name: "bakingTemp", label: "烘烤温度 (°C)", placeholder: "例：220" },
  { name: "bakingTime", label: "烘烤时间", placeholder: "例：25分钟" },
  { name: "difficulty", label: "难度", placeholder: "入门/进阶/高级" },
  { name: "tips", label: "制作心得", type: "textarea" as const, placeholder: "经验技巧..." },
  { name: "rating", label: "评分 (1-5)", placeholder: "例：4.5" },
];

export function BreadRecipesList({ initialRecipes }: Props) {
  const recipes = initialRecipes;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8B0A8] mb-1">Bread Recipes</p>
          <h1 className="text-2xl font-bold text-[#2C2825] tracking-tight">面包制作方法</h1>
        </div>
        <EntityDialog
          title="添加面包配方"
          buttonLabel="添加配方"
          apiEndpoint="/api/bread-recipes"
          fields={breadRecipeFields}
        />
      </div>

      {recipes.length === 0 ? (
        <p className="text-[#B8B0A8] text-center py-12 text-sm">暂无面包配方，添加你的第一个配方吧</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <Link key={r.id} href={`/bread/recipes/${r.id}`}>
              <Card className="glass-card-interactive border-0 h-full cursor-pointer">
                <CardHeader className="pb-2 px-5 pt-5">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="text-[#2C2825]">{r.name}</span>
                    {r.rating != null && <span className="text-sm text-[#8B7355]">⭐ {r.rating}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 px-5 pb-5">
                  <div className="flex flex-wrap gap-1.5">
                    {r.breadType && <Badge variant="outline" className="rounded-md text-[11px] border-[#E8E2DA] text-[#9C9490]">{r.breadType}</Badge>}
                    {r.difficulty && <Badge variant="secondary" className="rounded-md bg-[#F0ECE6] text-[#8B7355] border-0 text-[11px]">{r.difficulty}</Badge>}
                  </div>
                  <div className="text-[#9C9490] text-xs space-y-1">
                    {r.fermentation && <p>发酵：{r.fermentation}</p>}
                    {r.bakingTemp && <p>烘烤：{r.bakingTemp}°C{r.bakingTime ? ` / ${r.bakingTime}` : ""}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
