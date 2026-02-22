import z from "zod";

const paramsSchema = z.object({
  chapterId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid chapterId"),
});

export const chapterRemoveSchema = z.object({
  params: paramsSchema,
});
