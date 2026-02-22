import z from "zod";

const Params = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid courseId"),
});
export const GetCourseReviewSchema = z.object({
  params: Params,
});
