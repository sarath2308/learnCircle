import { IUser } from "@/common";
import { ILearnerProfile } from "../model/learner.profile.model";
import { LearnerProfileDTOType } from "../dtos/schemas/profile.response.dto";

export interface ILearnerProfileMapperService {
  /**
   * Converts a user and learner profile into a LearnerProfileDTOType
   * @param user - The user object from the User model
   * @param learnerProfile - The learner profile object
   * @returns LearnerProfileDTOType
   */
  toDTO(user: IUser, learnerProfile: ILearnerProfile, profileUrl?: string): LearnerProfileDTOType;
}
