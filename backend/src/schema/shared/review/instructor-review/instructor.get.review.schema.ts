import z from "zod";

const Params = z.object({
  instructorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid instructorId"),
});
export const GetInstructorReviewSchema = z.object({
  params: Params,
});
