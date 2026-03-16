import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createBreadRecipeSchema } from "@/lib/validations";
import { safeParseFloat } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const recipe = await prisma.breadRecipe.findUnique({ where: { id: parseInt(id, 10) } });
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("GET /api/bread-recipes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = createBreadRecipeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }
    const d = result.data;
    const recipe = await prisma.breadRecipe.update({
      where: { id: parseInt(id, 10) },
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
        notes: d.notes ?? null,
        rating: safeParseFloat(d.rating),
      },
    });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("PUT /api/bread-recipes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.breadRecipe.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bread-recipes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
