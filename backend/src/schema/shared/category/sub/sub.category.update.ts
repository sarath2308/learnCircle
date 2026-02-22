import { z } from "zod";
import { CategoryParamsSchema } from "../category.update.schema";

const SubCategoryBodySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  categoryId: z.string().min(1, "Parent Category ID is required"),
  isBlocked: z.boolean().default(false),
});

export const SubCategoryParamsSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
});

export const SubCategoryUpdateSchema = z.object({
  params: CategoryParamsSchema,
  body: SubCategoryBodySchema,
});

export type SubCategoryUpdateDtoType = z.infer<typeof SubCategoryBodySchema>;
