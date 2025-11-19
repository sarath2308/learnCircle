import { z } from "zod";

const CategoryBodySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  isBlocked: z.boolean().default(false),
});

export const CategoryParamsSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
});

export const CategoryUpdateSchema = z.object({
  params: CategoryParamsSchema,
  body: CategoryBodySchema,
});

export type CategoryUpdateDtoType = z.infer<typeof CategoryBodySchema>;
