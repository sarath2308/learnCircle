import type { ILearner } from "../../models/Learner";
import { Model } from "mongoose";
import { BaseRepo } from "../Base/base";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/types";
@injectable()
export class LearnerRepo extends BaseRepo<ILearner> {
  constructor(@inject(TYPES.LearnerModel) private Learner: Model<ILearner>) {
    super(Learner);
  }
}
