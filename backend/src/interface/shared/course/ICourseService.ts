import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { UploadedFile } from "../uploadFile.interface";

export default interface ICourseService {
  createCourse: (
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ) => Promise<{ courseId: string }>;
  getCourse: (courseId: string) => Promise<any>;
  getAllCourse: () => Promise<any>;
  updatePriceDetails: (id: string, data: CoursePriceDtoType) => Promise<void>;
}
