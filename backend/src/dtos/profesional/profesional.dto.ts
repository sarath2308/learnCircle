import { z } from "zod";

const ProfileInfoSchema = z.object({
  bio: z.string().optional(),
  companyName: z.string().optional(),
  experience: z.number().optional(),
  rating: z.string().optional(),
  resume: z.string().optional(),
  sessionPrice: z.string().optional(),
  skills: z.string().optional(),
  status: z.string().optional(),
  title: z.string().optional(),
  totalSessions: z.string().optional(),
  typesOfSessions: z.array(z.string()).optional(),
});

export const ProfessionalRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6).optional(),
  profileImg: z.string().optional(),
  role: z.string().optional(),
  googleId: z.string().optional(),
  ProfileInfo: ProfileInfoSchema.optional(),
});

export const ProfessionalUpdateSchema = ProfessionalRequestSchema.partial();

export const ProfessionalResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  profileImg: z.string().url(),
  joinedAt: z.date(),
  isBlocked: z.boolean(),
  ProfileInfo: ProfileInfoSchema,
  RejectReason: z.string().optional(),
  role: z.string(),
  googleId: z.string().optional(),
});

export type ProfessionalRequestDTO = z.infer<typeof ProfessionalRequestSchema>;
export type ProfessionalUpdateDTO = z.infer<typeof ProfessionalUpdateSchema>;
export type ProfessionalResponseDTO = z.infer<typeof ProfessionalResponseSchema>;
