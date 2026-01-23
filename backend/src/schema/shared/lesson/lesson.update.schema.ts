import z from "zod";

const bodySchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  type: z.enum(["Video", "PDF", "Article", "YouTube", "Blog"]).optional(),
  link: z.string().optional(),
  order: z.number().optional(),
});

const paramsSchema = z.object({
  lessonId: z.string().min(1, "lesson ID is required"),
});

export const UpdateLessonSchema = z.object({
  body: bodySchema,
  params: paramsSchema,
});

export type UpdateLessonDto = z.infer<typeof bodySchema>;
