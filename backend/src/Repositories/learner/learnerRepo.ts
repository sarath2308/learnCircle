import type { ILearner } from "../../models/Learner";
import { Model, Document } from "mongoose";
import { BaseRepo } from "../Base/base";
export class LearnerRepo extends BaseRepo<ILearner> {
  constructor(private Learner: Model<ILearner & Document>) {
    super(Learner);
  }
}
