import { z } from "zod";

export const CategoryBodySchema = z.object({
  name: z.string().min(3, "Category name is required"),
  isBlocked: z.boolean().default(false),
});

export const CategoryCreateSchema = z.object({
  body: CategoryBodySchema,
});

export type CategoryCreateDtoType = z.infer<typeof CategoryBodySchema>;
