import { BaseRepo } from "@/common/baseRepo";
import { ILearnerProfileRepo } from "../interface/ILearnerProfileRepo";
import { ILearnerProfile } from "../model/learner.profile.model";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { TYPES } from "@/common/types/inversify/types";
@injectable()
export class LearnerProfileRepo extends BaseRepo<ILearnerProfile> implements ILearnerProfileRepo {
  constructor(@inject(TYPES.ILearnerProfileModel) private _model: Model<ILearnerProfile>) {
    super(_model);
  }
  /**
   *
   * @param id
   * @param key
   * @returns
   */
  async storeProfileKey(id: string, key: string): Promise<void> {
    await this._model.updateOne({ userId: id }, { $set: { profile_key: key } });
  }
  /**
   *
   * @param id
   * @param subject
   * @returns
   */
  async addSubject(id: string, subject: string): Promise<ILearnerProfile | null> {
    return await this._model.findByIdAndUpdate(
      id,
      { $push: { currentSubject: subject } },
      { new: true },
    );
  }
  /**
   *
   * @param id
   * @returns
   */
  async findByUserId(id: string): Promise<ILearnerProfile | null> {
    return await this._model.findOne({ userId: id });
  }
  /**
   *
   * @param id
   * @returns
   */
  async updateLastLogin(id: string): Promise<ILearnerProfile | null> {
    return await this._model.findOneAndUpdate(
      { useId: id },
      { lastLogin: new Date() },
      { new: true },
    );
  }
}
