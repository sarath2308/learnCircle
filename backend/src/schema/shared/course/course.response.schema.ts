import z from "zod";

export const courseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  subCategory: z.string().optional(),
  skillLevel: z.string(),
  price: z.number().optional(),
  discount: z.number().optional(),
  type: z.string(),
  status: z.string(),
  thumbnailUrl: z.string().optional(),
});

export type courseResponseType = z.infer<typeof courseResponseSchema>;
