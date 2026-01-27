import z from "zod";

export const learnerLessonResponseSchema = z.object({
  chapterId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["Video", "PDF", "Article", "YouTube", "Blog"]),
  fileUrl: z.string().optional(),
  link: z.string().optional(),
  thumbnailUrl: z.string(),
  order: z.number(),
});

export type LearnerLessonResponseType = z.infer<typeof learnerLessonResponseSchema>;
