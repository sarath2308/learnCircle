import z from "zod";

export const learnerChapterResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  lessonCount: z.number(),
});

export type LearnerChapterResponseType = z.infer<typeof learnerChapterResponse>;
