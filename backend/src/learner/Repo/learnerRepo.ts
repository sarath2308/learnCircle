import type { ILearner } from "../models/Learner";
import { Model } from "mongoose";
import { BaseRepo, IBaseRepo, IRepoRole, Role } from "@/common";
import { inject, injectable } from "inversify";
import { TYPES } from "../../common/types/inversify/types";
export interface ILearnerRepo extends IBaseRepo<ILearner>, IRepoRole {
  updateProfilePhoto: (userId: string, publicId: string) => Promise<ILearner | null>;
}
@injectable()
export class LearnerRepo extends BaseRepo<ILearner> implements ILearnerRepo {
  readonly role: string = Role.Learner;
  constructor(@inject(TYPES.LearnerModel) private Learner: Model<ILearner>) {
    super(Learner);
  }
  async updateProfilePhoto(userId: string, publicId: string) {
    let res = await this.Learner.findByIdAndUpdate(
      { _id: userId },
      { $set: { publicId: publicId } },
    );
    return res;
  }
}
