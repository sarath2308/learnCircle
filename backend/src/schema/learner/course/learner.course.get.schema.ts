import z from "zod";

const Params = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
});

export const LearnerCourseGetSchema = z.object({
  params: Params,
});
