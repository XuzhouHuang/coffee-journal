import { z } from "zod/v4";

export const createBeanSchema = z.object({
  name: z.string().min(1, "豆名不能为空"),
  roasterId: z.number().int().positive().nullable().optional(),
  regionId: z.number().int().positive().nullable().optional(),
  varietyId: z.number().int().positive().nullable().optional(),
  process: z.string().nullable().optional(),
  roastLevel: z.string().nullable().optional(),
  flavorNotes: z.string().nullable().optional(),
  score: z.union([z.number(), z.string()]).nullable().optional(),
});

export const updateBeanSchema = createBeanSchema;

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
