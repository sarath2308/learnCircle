import z from "zod";
import { UpdateReviewBodySchema } from "../review.update.body.schema";

const Params = z.object({
  reviewId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid reviewId"),
});
export const UpdateCourseReviewSchema = z.object({
  body: UpdateReviewBodySchema,
  params: Params,
});

export type UpdateCourseReviewType = z.infer<typeof UpdateCourseReviewSchema>;
