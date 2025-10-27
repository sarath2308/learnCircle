import { inject, injectable } from "inversify";
import { IProfessionalProfileRepo } from "../interface/IProfessionalProfileRepo";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalProfile } from "../models/profesional.profile";
import { Model } from "mongoose";
import { BaseRepo } from "@/common/baseRepo";
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
  async getAllProfile(): Promise<IProfessionalProfile[] | null> {
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
      {
        $project: {
          _id: 1,
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
}
