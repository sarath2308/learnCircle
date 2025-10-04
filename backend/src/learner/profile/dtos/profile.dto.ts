import { LearnerDto } from "../../../dtos/types/learner.dto.type";
import { z } from "zod";
export const LearnerProfileDTO = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["learner", "professional", "admin"]),
  profileImg: z.string().nullable().optional(),
  currentSubject: z.array(z.string()).optional(),
  joinedAt: z.string(),
  lastLogin: z.string().nullable().optional(),
  hasPassword: z.boolean(),
});

export function mapProfileToDTO(learner: Partial<LearnerDto>) {
  return LearnerProfileDTO.partial().parse({
    name: learner.name,
    email: learner.email,
    role: learner.role,
    profileImg: learner.profileImg ?? null,
    currentSubject: learner.currentSubject ?? [],
    joinedAt: learner.joinedAt?.toISOString(),
    lastLogin: learner.lastLogin?.toISOString() ?? null,
    hasPassword: !!learner.passwordHash,
  });
}

// TypeScript types
export type LearnerProfileDTOType = z.infer<typeof LearnerProfileDTO>;
