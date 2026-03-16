import { prisma } from "@/lib/db";
import { BreadRecipesList } from "@/components/bread-recipes-list";

export const dynamic = "force-dynamic";

export default async function BreadRecipesPage() {
  const recipes = await prisma.breadRecipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    breadType: r.breadType,
    difficulty: r.difficulty,
    fermentation: r.fermentation,
    bakingTemp: r.bakingTemp,
    bakingTime: r.bakingTime,
    rating: r.rating,
    ingredients: r.ingredients,
    steps: r.steps,
  }));

  return <BreadRecipesList initialRecipes={serialized} />;
}
