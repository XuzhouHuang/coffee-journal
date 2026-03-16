import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBreadRecipeSchema } from "@/lib/validations";
import { safeParseFloat } from "@/lib/utils";

export async function GET() {
  try {
    const recipes = await prisma.breadRecipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("GET /api/bread-recipes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createBreadRecipeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const recipe = await prisma.breadRecipe.create({
      data: {
        name: d.name,
        breadType: d.breadType ?? null,
        ingredients: d.ingredients,
        steps: d.steps,
        fermentation: d.fermentation ?? null,
        bakingTemp: d.bakingTemp ?? null,
        bakingTime: d.bakingTime ?? null,
        difficulty: d.difficulty ?? null,
        tips: d.tips ?? null,
        rating: safeParseFloat(d.rating),
      },
    });
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("POST /api/bread-recipes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
