import z from "zod";

export const courseDetailsSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    createdAt: z.date(),
    createdBy: z.string(),
    chapterCount: z.number(),
    thumbnailUrl: z.string(),
})

export type CourseDetailsResponseType = z.infer<typeof courseDetailsSchema>;