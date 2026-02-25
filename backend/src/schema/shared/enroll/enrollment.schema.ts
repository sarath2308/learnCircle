import z from "zod";

export const EnrollmentParamsSchema = z.object({
  params: z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
  }),
});
