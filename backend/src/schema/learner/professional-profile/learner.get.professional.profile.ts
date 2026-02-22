import z from "zod";

export const GetLearnerProfessionalProfileSchema = z.object({
  params: z.object({
    instructorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
  }),
});
