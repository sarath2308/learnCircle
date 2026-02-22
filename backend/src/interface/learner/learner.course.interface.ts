import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";
import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";

export interface ILearnerCourseService {
  getCourseData: (courseId: string, userId: string) => Promise<LearnerCourseResponse>;
  getAllCourseData: (filter: LearnerAllCourseRequestType) => Promise<userCourseCardResponseType[]>;
}
