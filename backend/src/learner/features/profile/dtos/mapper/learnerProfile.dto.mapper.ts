import { injectable } from "inversify";
import { LearnerProfileDTO, LearnerProfileDTOType } from "../schemas/profile.response.dto";
import { IUser } from "@/common";
import { ILearnerProfile } from "../../model/learner.profile.model";
import { ILearnerProfileMapperService } from "../../interface/ILearnerProfileMapper";

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
      streak: learnerProfile?.streak,
      hasPassword: !!user.passwordHash,
      isBlocked: user.isBlocked ?? false,
    });
  }
}
