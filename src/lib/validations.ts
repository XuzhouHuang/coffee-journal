import { z } from "zod/v4";

export const createBeanSchema = z.object({
  name: z.string().min(1, "豆名不能为空"),
  roasterId: z.number().int().positive().nullable().optional(),
  regionId: z.number().int().positive().nullable().optional(),
  varietyId: z.number().int().positive().nullable().optional(),
  origin: z.string().nullable().optional(),
  altitude: z.string().nullable().optional(),
  species: z.string().nullable().optional(),
  process: z.string().nullable().optional(),
  roastLevel: z.string().nullable().optional(),
  roastInfo: z.string().nullable().optional(),
  producer: z.string().nullable().optional(),
  station: z.string().nullable().optional(),
  batch: z.string().nullable().optional(),
  flavorNotes: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  // Bean score and brew rating both use 1-5 scale
  score: z.union([z.number(), z.string()]).nullable().optional(),
});

export const updateBeanSchema = createBeanSchema.partial();

export const createBeanPurchaseSchema = z.object({
  price: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (isNaN(n)) throw new Error("价格无效");
    return n;
  }),
  weight: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'number' ? v : parseInt(String(v), 10);
    if (isNaN(n)) throw new Error("重量无效");
    return n;
  }),
  purchaseDate: z.string().min(1, "购买日期不能为空"),
  source: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const createBrewLogSchema = z.object({
  brewMethod: z.string().min(1, "冲煮方式不能为空"),
  dose: z.union([z.number(), z.string()]).nullable().optional(),
  waterAmount: z.union([z.number(), z.string()]).nullable().optional(),
  ratio: z.string().nullable().optional(),
  grindSize: z.string().nullable().optional(),
  waterTemp: z.union([z.number(), z.string()]).nullable().optional(),
  brewTime: z.string().nullable().optional(),
  rating: z.union([z.number(), z.string()]).nullable().optional(),
  notes: z.string().nullable().optional(),
  brewDate: z.string().min(1, "冲煮日期不能为空"),
});

export const createRegionSchema = z.object({
  country: z.string().min(1, "国家不能为空"),
  region: z.string().min(1, "产区不能为空"),
  subRegion: z.string().nullable().optional(),
  altitude: z.string().nullable().optional(),
  climate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const createVarietySchema = z.object({
  name: z.string().min(1, "品种名不能为空"),
  description: z.string().nullable().optional(),
  flavor: z.string().nullable().optional(),
});

export const createRoasterSchema = z.object({
  name: z.string().min(1, "烘焙商名不能为空"),
  country: z.string().min(1, "国家不能为空"),
  specialty: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  shopUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const createProcessingMethodSchema = z.object({
  name: z.string().min(1, "处理法名称不能为空"),
  description: z.string().nullable().optional(),
  flavorNotes: z.string().nullable().optional(),
  suitable: z.string().nullable().optional(),
});

export const createCafePurchaseSchema = z.object({
  cafeName: z.string().min(1, "店名不能为空"),
  location: z.string().nullable().optional(),
  drinkName: z.string().min(1, "饮品名不能为空"),
  drinkType: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (isNaN(n)) throw new Error("价格无效");
    return n;
  }),
  purchaseDate: z.string().min(1, "日期不能为空"),
  rating: z.union([z.number(), z.string()]).nullable().optional(),
  notes: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
});

export const createBreadPurchaseSchema = z.object({
  bakeryName: z.string().min(1, "面包店名不能为空"),
  location: z.string().nullable().optional(),
  breadName: z.string().min(1, "面包名不能为空"),
  breadType: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (isNaN(n)) throw new Error("价格无效");
    return n;
  }),
  purchaseDate: z.string().min(1, "日期不能为空"),
  notes: z.string().nullable().optional(),
});

export const createBreadRecipeSchema = z.object({
  name: z.string().min(1, "配方名不能为空"),
  breadType: z.string().nullable().optional(),
  ingredients: z.string().min(1, "原料不能为空"),
  steps: z.string().min(1, "步骤不能为空"),
  fermentation: z.string().nullable().optional(),
  bakingTemp: z.union([z.number(), z.string()]).nullable().optional().transform((v) => {
    if (v == null || v === '') return null;
    const n = typeof v === 'number' ? v : parseInt(v, 10);
    return isNaN(n) ? null : n;
  }),
  bakingTime: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  tips: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  rating: z.union([z.number(), z.string()]).nullable().optional(),
});
