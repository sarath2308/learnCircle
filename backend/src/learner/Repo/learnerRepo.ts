import type { ILearner } from "../models/Learner";
import { Model } from "mongoose";
import { BaseRepo } from "../Base/base";
import { inject, injectable } from "inversify";
import { TYPES } from "../../common/types/types";
@injectable()
export class LearnerRepo extends BaseRepo<ILearner> {
  constructor(@inject(TYPES.LearnerModel) private Learner: Model<ILearner>) {
    super(Learner);
  }
  async updateProfilePhoto(userId: string, publicId: string) {
    try {
      let res = await this.Learner.findByIdAndUpdate(
        { _id: userId },
        { $set: { publicId: publicId } },
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}
