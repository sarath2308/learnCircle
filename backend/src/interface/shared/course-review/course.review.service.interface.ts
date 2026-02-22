import { CourseReviewResponseType } from "@/schema/shared/review/course-review/course.review.response.schema";
import { CreateReviewBodyType } from "@/schema/shared/review/review..create.body.schema";
import { UpdateReviewBodyType } from "@/schema/shared/review/review.update.body.schema";

export interface ICourseReviewService {
  createCourseReview: (
    courseId: string,
    learnerId: string,
    data: CreateReviewBodyType,
  ) => Promise<CourseReviewResponseType>;
  getCourseReviews: (
    courseId: string,
  ) => Promise<{ averageRating: number; reviews: CourseReviewResponseType[] }>;
  updateCourseReview: (
    reviewId: string,
    data: UpdateReviewBodyType,
  ) => Promise<CourseReviewResponseType>;
  deleteCourseReview: (reviewId: string) => Promise<void>;
}
