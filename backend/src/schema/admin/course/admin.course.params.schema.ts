import z from "zod";

const Params = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
});

const bodySchema = z.object({
  reason: z.string().optional(),
});

export const adminCourseCrudParams = z.object({
  params: Params,
  body: bodySchema,
});
