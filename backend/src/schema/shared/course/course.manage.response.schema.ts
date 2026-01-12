import z from "zod";

export const courseManageResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  skillLevel: z.string(),
  price: z.number().optional(),
  discount: z.number().optional(),
  type: z.string(),
  status: z.string(),
});

export type courseManageResponseType = z.infer<typeof courseManageResponseSchema>;
