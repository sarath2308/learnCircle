import z from "zod";

export const adminChapterResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  lessonCount: z.number(),
});

export type AdminChapterResponseType = z.infer<typeof adminChapterResponse>;
