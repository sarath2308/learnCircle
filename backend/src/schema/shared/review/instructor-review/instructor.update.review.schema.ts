import z from "zod";
import { UpdateReviewBodySchema } from "../review.update.body.schema";

const Params = z.object({
  reviewId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid reviewId"),
});
export const UpdateInstructorReviewSchema = z.object({
  body: UpdateReviewBodySchema,
  params: Params,
});
