import z from "zod";
const bodySchema = z.object({
  title: z.string().nonempty("Title is required").min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters"),

  order: z.number().min(1, "order should be greater than 0"),
});

const paramsSchema = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid courseId"),
});

export const chapterCreateSchema = z.object({
  body: bodySchema,
  params: paramsSchema,
});

export type CreateChapterType = z.infer<typeof bodySchema>;
