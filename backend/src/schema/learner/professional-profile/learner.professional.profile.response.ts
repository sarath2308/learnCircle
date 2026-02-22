import { z } from "zod";

export const LearnerProfessionalProfileResponseSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "name is required"),
  bio: z.string().min(1, "bio is required"),
  companyName: z.string().min(1, "companyName is required"),
  experience: z.number().nonnegative(),
  profileUrl: z.string().min(1, "profileUrl is required"),
  rating: z.number().min(0).max(5),
  sessionPrice: z.number().nonnegative(),
  skills: z.array(z.string().min(1)).nonempty("skills cannot be empty"),
  title: z.string().min(1, "title is required"),
  totalSessions: z.number().int().nonnegative(),
  typesOfSessions: z.array(z.string().min(1)).nonempty("typesOfSessions cannot be empty"),
  instructorId: z.string().min(1, "instructorId is required"),
});

export type LearnerProfessionalProfileResponseType = z.infer<
  typeof LearnerProfessionalProfileResponseSchema
>;
