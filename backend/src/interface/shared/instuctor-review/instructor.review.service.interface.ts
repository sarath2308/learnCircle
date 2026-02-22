import { InstructorReviewResponseType } from "@/schema/shared/review/instructor-review/instructor.review.response.schema";
import { CreateReviewBodyType } from "@/schema/shared/review/review..create.body.schema";
import { UpdateReviewBodyType } from "@/schema/shared/review/review.update.body.schema";

export interface IInstructorReviewService {
  createReview: (
    instructorId: string,
    userId: string,
    data: CreateReviewBodyType,
  ) => Promise<InstructorReviewResponseType>;

  editReview: (
    reviewId: string,
    data: UpdateReviewBodyType,
  ) => Promise<InstructorReviewResponseType>;
  getAllReviewOfInstructor: (
    instructorId: string,
  ) => Promise<{ reviews: InstructorReviewResponseType[]; averageRating: number }>;
  deleteInstructorReview: (reviewId: string) => Promise<void>;
}
