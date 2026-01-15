import { z } from "zod";

export const userCourseCardResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),

  category: z.object({
    id: z.string(),
    name: z.string(),
  }),

  subCategory: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),

  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),

  thumbnailUrl: z.string().url(),

  price: z.number().optional(),
  discount: z.number().optional(),

  type: z.enum(["Free", "Paid"]),

  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
  }),

  chapterCount: z.number().optional(),
  totalDuration: z.number().optional(),
  averageRating: z.number().optional(),

  createdAt: z.string(),
});

export type userCourseCardResponseType = z.infer<typeof userCourseCardResponseSchema>;
