import { ILearner } from "../../learner/models/Learner";
import { LearnerProfileDTOType } from "../../learner/features/profile/dtos/profile.dto";
export interface LearnerDto extends ILearner {
  profileImg?: string;
}

export type PartialLearnerProfile = Partial<LearnerProfileDTOType>;
