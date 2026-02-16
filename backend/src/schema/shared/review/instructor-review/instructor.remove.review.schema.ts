import z from "zod";

const Params = z.object({
  reviewId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid reviewId"),
});
export const RemoveInstructorReviewSchema = z.object({
  params: Params,
});
