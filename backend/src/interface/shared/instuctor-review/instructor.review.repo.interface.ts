import { IInstructorReview } from "@/model/shared/insturctor.review.mode";
import { IBaseRepo } from "@/repos/shared/base";

export interface IInstructorReviewRepo extends IBaseRepo<IInstructorReview> {
  findByInstructorAndLearner?: (
    instructorId: string,
    learnerId: string,
  ) => Promise<IInstructorReview | null>;

  findAllReviewOfInstructor: (
    instructorId: string,
  ) => Promise<{ averageRating: number; reviews: IInstructorReview[] | [] }>;

  findAverageRatingOfInstructor: (instructorId: string) => Promise<{ averageRating: number }>;
}
