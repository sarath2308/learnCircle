import { z } from "zod";

export const ProfessionalProfileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be less than 500 characters"),
  companyName: z.string().min(1, "Company name is required"),

  // Convert string to number and validate range
  experience: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(1, "Experience should be at least 1 year").max(50, "Experience seems too high"),
  ),

  // Convert JSON string to array, fallback to empty array if invalid
  skills: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).min(1, "At least one skill is required"),
  ),

  typesOfSessions: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).min(1, "At least one session type is required"),
  ),
});
export type ProfessionalProfileDTOType = z.infer<typeof ProfessionalProfileSchema>;
