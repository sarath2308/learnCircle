import z from "zod";

const bodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["Video", "PDF", "Article", "YouTube", "Blog"]),
  link: z.string().optional(),
  order: z.number(),
});

const paramsSchema = z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
});

export const createLessonSchema = z.object({
  body: bodySchema,
  params: paramsSchema,
});

export type CreateLessonDto = z.infer<typeof bodySchema>;
