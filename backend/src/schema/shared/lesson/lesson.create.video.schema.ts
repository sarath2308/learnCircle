import z from "zod";

const bodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["Video"]),
  order: z.number(),
  originalFileName: z.string().min(1, "Original file name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

const paramsSchema = z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
});

export const createLessonWithVideoSchema = z.object({
  body: bodySchema,
  params: paramsSchema,
});
export type CreateLessonWithVideoDto = z.infer<typeof bodySchema>;
