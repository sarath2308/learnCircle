import z from "zod";

export const adminLessonResponseSchema = z.object({
  chapterId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["Video", "PDF", "Article", "YouTube", "Blog"]),
  file_key: z.string(),
  link: z.string().optional(),
  thumbnailUrl: z.string(),
  mediaStatus: z.enum(["ready", "pending", "uploaded", "failed"]),
  order: z.number(),
});

export type AdminLessonResponseType = z.infer<typeof adminLessonResponseSchema>;
