import { z } from "zod";

const ListCategoryQuerySchema = z.object({
  search: z.string().optional(),

  page: z.string().regex(/^\d+$/, "page must be a number").transform(Number).default(1).optional(),

  limit: z
    .string()
    .regex(/^\d+$/, "limit must be a number")
    .transform(Number)
    .default(10)
    .optional(),

  isBlocked: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === "true") return true;
      if (val === "false") return false;
      throw new Error("isBlocked must be true or false");
    }),

  sortBy: z.string().optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const ListCategorySchema = z.object({
  query: ListCategoryQuerySchema,
});

export type ListCategoryFilterType = z.infer<typeof ListCategoryQuerySchema>;
