import z from "zod";

const bodySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  category: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId")
    .optional(),
  subCategory: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid subCategoryId")
    .optional(),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  price: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
});

export const updateCourseSchema = z.object({
  body: bodySchema,
});

export type UpdateCourseDtoType = z.infer<typeof bodySchema>;
