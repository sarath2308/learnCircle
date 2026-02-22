import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { IInstructorReview } from "@/model/shared/insturctor.review.mode";
import { IInstructorReviewRepo } from "@/interface/shared/instuctor-review/instructor.review.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import mongoose, { Model } from "mongoose";

@injectable()
export class InstructorReviewRepo
  extends BaseRepo<IInstructorReview>
  implements IInstructorReviewRepo
{
  constructor(
    @inject(TYPES.IInstructorReviewModel) private _instructorReviewModel: Model<IInstructorReview>,
  ) {
    super(_instructorReviewModel);
  }

  async findAllReviewOfInstructor(
    instructorId: string,
  ): Promise<{ averageRating: number; reviews: IInstructorReview[] | [] }> {
    const objId = new mongoose.Types.ObjectId(instructorId);

    const result = await this._instructorReviewModel.aggregate([
      { $match: { instructorId: objId, isDeleted: false } },
      {
        $group: {
          _id: "$instructorId",
          averageRating: { $avg: "$rating" },
          reviews: { $push: "$$ROOT" },
        },
      },
    ]);

    return result[0] || { averageRating: 0, reviews: [] };
  }

  async findAverageRatingOfInstructor(instructorId: string): Promise<{ averageRating: number }> {
    const objId = new mongoose.Types.ObjectId(instructorId);

    const result = await this._instructorReviewModel.aggregate([
      {
        $match: { instructorId: objId, isDeleted: false },
      },
      {
        $group: {
          _id: "$instructorId",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length === 0) {
      return { averageRating: 0 };
    }

    return {
      averageRating: Number(result[0].averageRating.toFixed(1)), // optional rounding
    };
  }

  async findByInstructorAndLearner(
    instructorId: string,
    learnerId: string,
  ): Promise<IInstructorReview | null> {
    return await this._instructorReviewModel.findOne({
      instructorId: instructorId,
      learnerId: learnerId,
      isDeleted: false,
    });
  }
}
