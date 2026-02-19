import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IInstructorReview } from "@/model/shared/insturctor.review.mode";
import {
  InstructorReviewResponseSchema,
  InstructorReviewResponseType,
} from "@/schema/shared/review/instructor-review/instructor.review.response.schema";
import { injectable } from "inversify";

@injectable()
export class InstructorReviewMapper implements IMapper<
  IInstructorReview,
  InstructorReviewResponseType
> {
  map(input: IInstructorReview): InstructorReviewResponseType {
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
      comment: input.comment ?? "",
      createdAt: formatDate(input.createdAt),
      userId: String(input.learnerId),
    };

    return InstructorReviewResponseSchema.parse(responseObj);
  }
}
