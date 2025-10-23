import { z } from "zod";

export const LearnerProfileDTO = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["learner", "professional", "admin"]),
  profileImg: z.string().nullable().optional(),
  currentSubject: z.array(z.string()).optional(),
  joinedAt: z.string(),
  lastLogin: z.string().nullable().optional(),
  hasPassword: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
});

export type LearnerProfileDTOType = z.infer<typeof LearnerProfileDTO>;
