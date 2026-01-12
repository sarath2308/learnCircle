import z from "zod";

export const courseDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  category: z.string(),
  skillLevel: z.string(),
  price: z.number().optional(),
  type: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  createdBy: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
  }),
  isBlocked: z.boolean().optional(),
  chapterCount: z.number(),
  thumbnailUrl: z.string(),
});

export type CourseDetailsResponseType = z.infer<typeof courseDetailsSchema>;
