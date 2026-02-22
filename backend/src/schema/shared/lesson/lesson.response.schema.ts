import z from "zod";

export const LessonResponseSchema = z.object({
  id: z.string(),
  chapterId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["Video", "PDF", "Article", "YouTube", "Blog"]),
  fileUrl: z.string().optional(),
  link: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  mediaStatus: z.enum(["ready", "pending", "uploaded", "failed"]),
  order: z.number(),
  duration: z.number().optional(),
  createdAt: z.string(),
});

export type LessonResponseDto = z.infer<typeof LessonResponseSchema>;
