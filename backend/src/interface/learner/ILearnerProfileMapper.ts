import { IUser } from "@/model/shared/user.model";
import { ILearnerProfile } from "@/model/learner/learner.profile.model";
import { LearnerProfileDTOType } from "@/schema/learner/profile.response.dto";

export interface ILearnerProfileMapperService {
  /**
   * Converts a user and learner profile into a LearnerProfileDTOType
   * @param user - The user object from the User model
   * @param learnerProfile - The learner profile object
   * @returns LearnerProfileDTOType
   */
  toDTO(user: IUser, learnerProfile: ILearnerProfile, profileUrl?: string): LearnerProfileDTOType;
}
