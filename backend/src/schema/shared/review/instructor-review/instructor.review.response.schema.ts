import z from "zod";

export const InstructorReviewResponseSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().optional(),
  createdAt: z.string(),
});

export type InstructorReviewResponseType = z.infer<typeof InstructorReviewResponseSchema>;
