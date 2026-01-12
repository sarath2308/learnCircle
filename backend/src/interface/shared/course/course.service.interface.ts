import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { UploadedFile } from "../uploadFile.interface";
import { courseResponseType } from "@/schema/shared/course/course.response.schema";
import { courseManageResponseType } from "@/schema/shared/course/course.manage.response.schema";

export default interface ICourseService {
  createCourse: (
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ) => Promise<{ courseId: string }>;
  editCourse: (courseId: string, payload: Partial<createCourseDtoType>) => Promise<void>;
  getCourseDataForCourseCreation: (courseId: string) => Promise<courseResponseType>;
  getAllCourse: () => Promise<any>;
  updatePriceDetails: (id: string, data: CoursePriceDtoType) => Promise<void>;
  getCourseDataForUserHome: () => Promise<void>;
  getCouseDataForCourseManagement: (userId: string) => Promise<courseManageResponseType[]>;
  getCourseById: (courseId: string) => Promise<courseResponseType>;
}
