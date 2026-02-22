import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { LearnerProfileDTOType } from "@/schema/learner/profile.response.dto";
import { CategoryDto } from "@/schema/shared/category/category.response.schema";

export interface ILearnerHomeService {
  getHome: (userId: string) => Promise<{
    categoryData: CategoryDto[];
    courseCardData: userCourseCardResponseType[];
    userData: LearnerProfileDTOType | null;
  }>;
}
