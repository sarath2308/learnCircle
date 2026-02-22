import z from "zod";

export const LearnerGetAvailabilitySchema = z.object({
  query: z.object({
    instructorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid courseId"),
    date: z.coerce.date(),
  }),
});
