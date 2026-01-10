import { CourseDetailsResponseType } from "@/schema/admin/course/course.details";
import { AdminCourseDetailsResponse } from "@/types/admin/course/admin.course.manage.type";

export interface IAdminCourseManagementService {
  getAllCourseData: (
    page: number,
    limit: number,
  ) => Promise<{ courseData: CourseDetailsResponseType[]; TotalCourseCount: number }>;
  getCourseDetails: (courseId: string) => Promise<AdminCourseDetailsResponse>;
  approveCourse: (courseId: string) => Promise<void>;
  rejectCourse: (courseId: string, reason: string) => Promise<void>;
  blockCourse: (courseId: string, reason: string) => Promise<void>;
  unblockCourse: (courseId: string) => Promise<void>;
}
