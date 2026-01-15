import { CourseDetailsResponseType } from "@/schema/admin/course/course.details";

export interface IAdminCourseManagementService {
  getAllCourseData: (
    page: number,
    limit: number,
  ) => Promise<{ courseData: CourseDetailsResponseType[]; TotalCourseCount: number }>;
  approveCourse: (courseId: string) => Promise<void>;
  rejectCourse: (courseId: string, reason: string) => Promise<void>;
  blockCourse: (courseId: string, reason: string) => Promise<void>;
  unblockCourse: (courseId: string) => Promise<void>;
}
