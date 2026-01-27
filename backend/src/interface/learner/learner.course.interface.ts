import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";

export interface ILearnerCourseService {
  getCourseData: (courseId: string, userId: string) => Promise<LearnerCourseResponse>;
}
