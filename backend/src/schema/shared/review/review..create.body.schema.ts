import z from "zod";

export const CreateReviewBodySchema = z.object({
  rating: z.number(),
  comment: z.string(),
});

export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>;
