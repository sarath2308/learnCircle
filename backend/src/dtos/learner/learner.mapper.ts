import { LearnerDto } from "../types/learner.dto.type";
import { LearnerResponseDTO } from "./learner.dto";

export function mapLearnerToDTO(learner: LearnerDto) {
  return LearnerResponseDTO.parse({
    id: learner._id.toString(),
    name: learner.name,
    email: learner.email,
    role: learner.role,
    profileImg: learner.profileImg ?? null,
    currentSubject: learner.currentSubject ?? [],
    joinedAt: learner.joinedAt?.toISOString(),
    lastLogin: learner.lastLogin?.toISOString() ?? null,
    isBlocked: learner.isBlocked ?? false,
    hasPassword: !!learner.passwordHash,
  });
}
