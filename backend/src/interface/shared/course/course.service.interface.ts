import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { UploadedFile } from "../uploadFile.interface";
import { courseResponseType } from "@/schema/shared/course/course.response.schema";
import { courseManageResponseType } from "@/schema/shared/course/course.manage.response.schema";
import { CourseStatus } from "./course.repo.interface";
import { CreatorCourseViewResponse } from "@/types/admin/course/admin.course.manage.type";
import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";

export default interface ICourseService {
  createCourse: (
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ) => Promise<{ courseId: string }>;
  editCourse: (
    courseId: string,
    payload: Partial<createCourseDtoType>,
    thumbnail?: UploadedFile | undefined,
  ) => Promise<void>;
  publishCourse: (courseId: string) => Promise<void>;
  getCourseDataForCourseCreation: (courseId: string) => Promise<courseResponseType>;
  getAllCourse: () => Promise<any>;
  updatePriceDetails: (id: string, data: CoursePriceDtoType) => Promise<void>;
  getCourseDataForUserHome: () => Promise<userCourseCardResponseType[]>;
  getCouseDataForCourseManagement: (
    userId: string,
    filter: {
      status?: CourseStatus;
      search?: string;
      type?: string;
      category?: string;
      subCategory?: string;
      rating?: string;
      skillLevel?: string;
    },
  ) => Promise<courseManageResponseType[]>;
  getCourseById: (courseId: string) => Promise<courseResponseType>;
  getCourseDataForCreatorView: (courseId: string) => Promise<CreatorCourseViewResponse>;
}
