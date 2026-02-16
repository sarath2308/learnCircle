import z from "zod";

export const CourseReviewResponseSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().optional(),
  createdAt: z.string(),
});

export type CourseReviewResponseType = z.infer<typeof CourseReviewResponseSchema>;
