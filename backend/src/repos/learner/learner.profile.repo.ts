import { BaseRepo } from "../shared/base";
import { ILearnerProfileRepo } from "@/interface/learner/learner.profile.repo.interface";
import { ILearnerProfile } from "@/model/learner/learner.profile.model";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { TYPES } from "@/types/shared/inversify/types";
import { AggregatedLearnerProfile } from "@/types/learner/AggregatedLearnerProfile";
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
   *this method is to add subject
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
  async getAllProfile(page: number, search: string): Promise<AggregatedLearnerProfile[] | []> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const searchFilter = search
      ? {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    return await this._model.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: searchFilter },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          userId: 1,
          name: "$user.name",
          email: "$user.email",
          isBlocked: "$user.isBlocked",
          role: "$user.role",
          profile_key: 1,
        },
      },
    ]);
  }
  async countAll(search: string) {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    return this._model.countDocuments(query);
  }
}
