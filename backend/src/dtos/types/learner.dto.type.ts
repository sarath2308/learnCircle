import { ILearner } from "../../models/Learner";
import { LearnerProfileDTOType } from "../learner/profile.dto";
export interface LearnerDto extends ILearner {
  profileImg?: string;
}

export type PartialLearnerProfile = Partial<LearnerProfileDTOType>;
