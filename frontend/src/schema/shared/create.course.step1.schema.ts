import { z } from "zod";

export const Step1Schema = z.object({
  title: z.string().nonempty("Title is required").min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters"),

  category: z.string().nonempty("Category is required"),

  skillLevel: z.string().nonempty("Skill level is required"),
});

export type Step1SchemaType = z.infer<typeof Step1Schema>;
