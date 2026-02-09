import { inject, injectable } from "inversify";
import { IProfessionalProfileRepo } from "@/interface/professional/professional.profile.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { IProfessionalProfile } from "@/model/professional/professional.profile";
import mongoose, { Model } from "mongoose";
import { BaseRepo } from "../shared/base";
import { AggregatedProfessionalProfile } from "@/types/professional/AggregatedProfessionalProfile";
import { IProfessionalDocumentResponse } from "@/types/professional/professional.profile.type";
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
  async getAllProfileForAdmin(
    page: number,
    search: string,
  ): Promise<AggregatedProfessionalProfile[] | []> {
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

  async getAllProfileForUser(
    page: number,
    search: string,
  ): Promise<AggregatedProfessionalProfile[] | []> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
          "user.isBlocked": false,
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
          title: 1,
        },
      },
    ]);
  }
  async getProfileOfInstructor(
    instructorId: string,
  ): Promise<IProfessionalDocumentResponse | null> {
    const objId = new mongoose.Types.ObjectId(instructorId);

    const result = await this._model.aggregate([
      { $match: { userId: objId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.isBlocked": false } },
      {
        $project: {
          userId: 1,
          name: "$user.name",
          bio: 1,
          companyName: 1,
          experience: 1,
          profile_key: 1,
          rating: 1,
          sessionPrice: 1,
          skills: 1,
          title: 1,
          totalSessions: 1,
          typesOfSessions: 1,
          email: "$user.email",
        },
      },
      { $limit: 1 },
    ]);

    return result[0] || null;
  }
}
