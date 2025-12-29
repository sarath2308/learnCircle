import z from "zod";

export const courseResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  skillLevel: z.string(),
  price: z.number().optional(),
  discount: z.number().optional(),
  type: z.string(),
  status: z.string(),
});

export type courseResponseType = z.infer<typeof courseResponseSchema>;
