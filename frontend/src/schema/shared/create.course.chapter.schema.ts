import z from "zod"
export const ChapterSchema = z.object({
     title: z
       .string()
       .nonempty("Title is required")
       .min(5, "Title must be at least 5 characters"),
     
     description: z
       .string()
       .nonempty("Description is required")
       .min(10, "Description must be at least 10 characters"),
})