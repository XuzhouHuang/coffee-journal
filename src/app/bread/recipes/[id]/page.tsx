import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BreadRecipeDetail } from "@/components/bread-recipe-detail";

export const dynamic = "force-dynamic";

export default async function BreadRecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipeId = parseInt(id, 10);
  if (isNaN(recipeId)) notFound();

  const recipe = await prisma.breadRecipe.findUnique({
    where: { id: recipeId },
  });
  if (!recipe) notFound();

  const serialized = {
    id: recipe.id,
    name: recipe.name,
    breadType: recipe.breadType,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    fermentation: recipe.fermentation,
    bakingTemp: recipe.bakingTemp,
    bakingTime: recipe.bakingTime,
    difficulty: recipe.difficulty,
    tips: recipe.tips,
    notes: recipe.notes,
    rating: recipe.rating,
    createdAt: recipe.createdAt.toISOString(),
  };

  return <BreadRecipeDetail recipe={serialized} />;
}
