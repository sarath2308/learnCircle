import z from "zod";

export const LearnerProfessionalProfileResponseSchema = z.object({
  name: z.string(),
  rating: z.number(),
  profileUrl: z.string(),
  title: z.string(),
  instructorId: z.string(),
});

export type LearnerProfessionalProfileResponseType = z.infer<
  typeof LearnerProfessionalProfileResponseSchema
>;
