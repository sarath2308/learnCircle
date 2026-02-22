import { z } from "zod";

export const SubCategorySchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
  name: z.string().min(3, "Category name is required"),
  category: z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
    name: z.string().min(3, "Category name is required"),
  }),
  isBlocked: z.boolean().default(false).optional(),
});

export const SubCategoryArraySchema = z.array(SubCategorySchema);
export type SubCategoryDto = z.infer<typeof SubCategorySchema>;
