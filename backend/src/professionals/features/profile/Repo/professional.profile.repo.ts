import { inject, injectable } from "inversify";
import { IProfessionalProfileRepo } from "../interface/IProfessionalProfileRepo";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalProfile } from "../models/profesional.profile";
import { Model } from "mongoose";
import { BaseRepo } from "@/common/baseRepo";
import { AggregatedProfessionalProfile } from "../types/AggregatedProfessionalProfile";
@injectable()
export class ProfessionalProfileRepo
  extends BaseRepo<IProfessionalProfile>
  implements IProfessionalProfileRepo
{
  constructor(
    @inject(TYPES.IProfessionalProfileModel) private _model: Model<IProfessionalProfile>,
  ) {
    super(_model);
  }
  async getProfile(id: string): Promise<IProfessionalProfile | null> {
    return await this._model.findOne({ userId: id }).populate("userId");
  }
  async getAllProfile(page: number, search: string): Promise<AggregatedProfessionalProfile[] | []> {
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
          email: "$user.email",
          name: "$user.name",
          isBlocked: "$user.isBlocked",
          role: "$user.role",
          userId: 1,
          status: 1,
          profile_key: 1,
          rating: 1,
          resume_key: 1,
          totalSessions: 1,
        },
      },
    ]);
  }
  async countAll(search: string) {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    return this._model.countDocuments(query);
  }
}
