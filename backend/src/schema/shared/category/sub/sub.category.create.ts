import { z } from "zod";

export const SubCategoryBodySchema = z.object({
  name: z.string().min(3, "Category name is required"),
  categoryId: z.string().min(1, "Parent Category ID is required"),
  isBlocked: z.boolean().default(false),
});

export const CategoryCreateSchema = z.object({
  body: SubCategoryBodySchema,
});

export type SubCategoryCreateDtoType = z.infer<typeof SubCategoryBodySchema>;
