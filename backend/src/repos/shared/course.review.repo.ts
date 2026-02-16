import { ICourseReview } from "@/model/shared/course.review.model";
import { BaseRepo } from "./base";
import { ICourseReviewRepo } from "@/interface/shared/course-review/course.review.interface";
import { inject, injectable } from "inversify";
import mongoose, { Model } from "mongoose";
import { TYPES } from "@/types/shared/inversify/types";

@injectable()
export class CourseReviewRepo extends BaseRepo<ICourseReview> implements ICourseReviewRepo {
  constructor(@inject(TYPES.ICourseReviewModel) private _courseReviewModel: Model<ICourseReview>) {
    super(_courseReviewModel);
  }

  async findByCourseAndLearner(courseId: string, learnerId: string): Promise<ICourseReview | null> {
    return await this._courseReviewModel.findOne({ courseId: courseId, learnerId: learnerId });
  }

  async getAllReviewsAndAverageByCourseId(
    courseId: string,
  ): Promise<{ averageRating: number; reviews: ICourseReview[] | [] }> {
    const objId = new mongoose.Types.ObjectId(courseId);

    const result = await this._courseReviewModel.aggregate([
      { $match: { courseId: objId, isDeleted: false } },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviews: { $push: "$$ROOT" },
        },
      },
    ]);

    return result[0] || { averageRating: 0, reviews: [] };
  }

  async findAverageRating(courseId: string): Promise<{ averageRating: number }> {
    const objId = new mongoose.Types.ObjectId(courseId);

    const result = await this._courseReviewModel.aggregate([
      {
        $match: { instructorId: objId, isDeleted: false },
      },
      {
        $group: {
          _id: "$courseId",
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
}
