import z from "zod";

export const SubCategoryUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
});

export type SubCategoryUserResponseType = z.infer<typeof SubCategoryUserResponseSchema>;
