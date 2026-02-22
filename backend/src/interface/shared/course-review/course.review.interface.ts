import { ICourseReview } from "@/model/shared/course.review.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface ICourseReviewRepo extends IBaseRepo<ICourseReview> {
  findByCourseAndLearner: (courseId: string, learnerId: string) => Promise<ICourseReview | null>;
  getAllReviewsAndAverageByCourseId: (
    courseId: string,
  ) => Promise<{ averageRating: number; reviews: ICourseReview[] | [] }>;
  findAverageRating: (courseId: string) => Promise<{ averageRating: number }>;
}
