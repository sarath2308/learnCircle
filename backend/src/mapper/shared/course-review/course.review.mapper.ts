import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { ICourseReview } from "@/model/shared/course.review.model";
import {
  CourseReviewResponseSchema,
  CourseReviewResponseType,
} from "@/schema/shared/review/course-review/course.review.response.schema";
import { injectable } from "inversify";

@injectable()
export class CourseReviewMapper implements IMapper<ICourseReview, CourseReviewResponseType> {
  map(input: ICourseReview): CourseReviewResponseType {
    function formatDate(date: Date): string {
      const d = new Date(date);

      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const yy = String(d.getFullYear()).slice(-2);

      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");

      return `${dd}-${mm}-${yy} ${hh}:${min}`;
    }
    const responseObj = {
      id: String(input._id),
      rating: input.rating,
      comment: input.comment,
      createdAt: formatDate(input.createdAt),
    };
    return CourseReviewResponseSchema.parse(responseObj);
  }
}
