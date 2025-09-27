import { z } from "zod";

// Request DTOs
export const CreateLearnerDTO = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: "learner",
});

export const UpdateLearnerDTO = z.object({
  name: z.string().min(1).optional(),
  email: z.string().optional(),
  profileImg: z.string().url().nullable().optional(),
  currentSubject: z.array(z.string()).optional(),
  password: z.string().optional(),
});

// Response DTOs
export const LearnerResponseDTO = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["learner", "professional", "admin"]),
  profileImg: z.string().nullable().optional(),
  currentSubject: z.array(z.string()).optional(),
  joinedAt: z.string(),
  lastLogin: z.string().nullable().optional(),
  isBlocked: z.boolean(),
  hasPassword: z.boolean(),
});

// TypeScript types
export type CreateLearnerDTOType = z.infer<typeof CreateLearnerDTO>;
export type UpdateLearnerDTOType = z.infer<typeof UpdateLearnerDTO>;
export type LearnerResponseDTOType = z.infer<typeof LearnerResponseDTO>;
