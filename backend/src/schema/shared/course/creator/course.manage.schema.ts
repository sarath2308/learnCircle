import z from "zod";

const paramSchema = z.object({
  status: z.enum(["draft", "published"]).optional(),
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId").optional(),
  type: z.enum(["Free", "Paid"]).optional(),
  skillLevel: z.enum(["Beginner", "InterMediate", "Advanced"]).optional(),
  search: z.string().optional(),
});

export const creatorCourseManagementSchema = z.object({
  params: paramSchema,
});
