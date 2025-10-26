import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const ProfessionalProfileResponseSchema = z.object({
  id: z.string(),
  user: UserResponseSchema,
  bio: z.string(),
  companyName: z.string(),
  experience: z.number(),
  profileUrl: z.string(),
  resumeUrl: z.string(),
  rating: z.number().optional().default(0),
  sessionPrice: z.number().optional(),
  skills: z.array(z.string()).default([]),
  title: z.string().optional(),
  totalSessions: z.number().optional().default(0),
  typesOfSessions: z.array(z.string()).default([]),
  status: z.string(),
  rejectReason: z.string().optional(),
});

// TypeScript type
export type ProfessionalDashboardResponseDTO = z.infer<typeof ProfessionalProfileResponseSchema>;
