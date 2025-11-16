import { injectable } from "inversify";
import { ILearnerProfile } from "../../model/learner/learner.profile.model";
import { ILearnerProfileMapperService } from "@/interface/learner/ILearnerProfileMapper";
import { IUser } from "@/model/shared/user.model";
import { LearnerProfileDTO, LearnerProfileDTOType } from "@/schema/learner/profile.response.dto";

@injectable()
export class LearnerProfileMapperService implements ILearnerProfileMapperService {
  public toDTO(
    user: IUser,
    learnerProfile?: ILearnerProfile | null,
    profileUrl?: string,
  ): LearnerProfileDTOType {
    return LearnerProfileDTO.parse({
      id: learnerProfile?._id.toString() ?? null,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImg: profileUrl ?? null,
      currentSubject: learnerProfile?.currentSubject ?? null,
      joinedAt: learnerProfile?.joinedAt?.toISOString() ?? null,
      lastLogin: learnerProfile?.lastLogin?.toISOString() ?? null,
      streak: learnerProfile?.streak || 0,
      hasPassword: !!user.passwordHash,
      isBlocked: user.isBlocked ?? false,
    });
  }
}
