import z from "zod";
const bodySchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(5, "Title must be at least 5 characters")
    .optional(),

  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters")
    .optional(),

  order: z.number().min(1, "order should be greater than 0").optional(),
});

const paramsSchema = z.object({
  chapterId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid chapterId"),
});

export const chapterEditSchema = z.object({
  body: bodySchema,
  params: paramsSchema,
});

export type EditChapterType = z.infer<typeof bodySchema>;
