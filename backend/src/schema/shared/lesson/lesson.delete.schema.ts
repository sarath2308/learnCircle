import z from "zod";

const paramsSchema = z.object({
  lessonId: z.string().min(1, "lesson ID is required"),
});

export const deleteLessonSchema = z.object({
  params: paramsSchema,
});
