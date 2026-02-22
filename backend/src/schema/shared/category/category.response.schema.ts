import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
  name: z.string().min(3, "Category name is required"),
  isBlocked: z.boolean().default(false).optional(),
});

export const CategoryArraySchema = z.array(CategorySchema);
export type CategoryDto = z.infer<typeof CategorySchema>;
