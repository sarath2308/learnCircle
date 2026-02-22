import z from "zod";

export const UpdateReviewBodySchema = z.object({
  rating: z.number().optional(),
  comment: z.string().optional(),
});

export type UpdateReviewBodyType = z.infer<typeof UpdateReviewBodySchema>;
