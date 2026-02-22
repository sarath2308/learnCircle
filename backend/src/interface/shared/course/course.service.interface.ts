import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { UploadedFile } from "../uploadFile.interface";
import { courseResponseType } from "@/schema/shared/course/course.response.schema";
import { courseManageResponseType } from "@/schema/shared/course/course.manage.response.schema";
import { CourseStatus } from "./course.repo.interface";
import { CreatorCourseViewResponse } from "@/types/admin/course/admin.course.manage.type";
import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";

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
  getAllCourseForUser: (
    filter: LearnerAllCourseRequestType,
  ) => Promise<userCourseCardResponseType[]>;
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
  getCourseDataForLearner: (courseId: string) => Promise<LearnerCourseResponse>;
  updateAverageRating: (courseId: string, rating: number) => Promise<void>;
}
