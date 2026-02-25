import z from "zod";

export const LearnerCourseDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.object({
    name: z.string(),
    id: z.string(),
  }),
  skillLevel: z.string(),
  price: z.number().optional(),
  discount: z.number().optional(),
  type: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  createdBy: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
  }),
  chapterCount: z.number(),
  thumbnailUrl: z.string(),
  isEnrolled: z.boolean(),
});

export type LearnerCourseDetailsResponseType = z.infer<typeof LearnerCourseDetailsSchema>;
