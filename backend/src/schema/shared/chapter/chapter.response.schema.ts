import z from "zod";

export const chapterResponseSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  isPublished: z.boolean(),
});

export type ChapterResponseType = z.infer<typeof chapterResponseSchema>;
