import z from "zod";

const bodySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export const createCourseSchema = z.object({
  body: bodySchema,
});

export type createCourseDtoType = z.infer<typeof bodySchema>;
