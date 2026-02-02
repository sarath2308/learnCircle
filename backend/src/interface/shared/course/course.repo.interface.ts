import { ICourse } from "@/model/shared/course.model";
import { IBaseRepo } from "@/repos/shared/base";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";
import { CoursePopulated } from "@/types/learner/course/course.home.card.type";

export type CourseStatus = "draft" | "published";

export default interface ICourseRepo extends IBaseRepo<ICourse> {
  updatePrice: (
    id: string,
    payload: { price: number; discount: number; type: "Free" | "Paid" },
  ) => Promise<void>;

  updateThumbnail: (id: string, key: string) => Promise<boolean>;
  getCourseWithTitle: (title: string) => Promise<ICourse | null>;
  increaseChapterCount: (courseId: string) => Promise<ICourse | null>;
  decreaseChapterCount: (courseId: string) => Promise<ICourse | null>;
  getAllCourse: (skip: number, limit: number) => Promise<ICourse[] | null>;
  getTotalCourseCount: () => Promise<number>;
  findById: (id: string) => Promise<ICourse | null>;
  getCourseDataFromUserId: (
    userId: string,
    query: {
      status?: CourseStatus;
      search?: string;
      type?: string;
      category?: string;
      subCategory?: string;
      rating?: string;
      skillLevel?: string;
    },
  ) => Promise<ICourse[]>;
  getAllCourseForUserHome: () => Promise<CoursePopulated[]>;
  findCourseWithOutPoppulate: (courseId: string) => Promise<ICourse | null>;
  getAllCourseForUser: (filter: LearnerAllCourseRequestType) => Promise<CoursePopulated[]>;
}
