import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import {
  CourseDetailsResponseType,
  courseDetailsSchema,
} from "@/schema/admin/course/course.details";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

export type CreatedByPopulated = {
  _id: Types.ObjectId;
  name: string;
  role: string;
};

export type CategoryObjType = {
  _id: Types.ObjectId;
  name: string;
};

@injectable()
export class AdminCourseManagementService implements IAdminCourseManagementService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo,
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
  ) {}
  /**
   *
   * @param page
   * @param limit
   * @returns
   */

  async getAllCourseData(
    page: number,
    limit: number,
  ): Promise<{ courseData: CourseDetailsResponseType[]; TotalCourseCount: number }> {
    const skip = (page - 1) * limit;
    const courseData = await this._courseRepo.getAllCourse(skip, limit);
    const totalCourseCount = await this._courseRepo.getTotalCourseCount();

    if (!courseData || courseData.length === 0) {
      return { courseData: [], TotalCourseCount: 0 };
    }

    const mappedResponse = await Promise.all(
      courseData.map(async (course) => {
        const courseObj = course.toObject();

        const thumbnailUrl = courseObj.thumbnail_key
          ? await this._s3Service.getFileUrl(courseObj.thumbnail_key)
          : undefined;
        const category = courseObj.category as unknown as CategoryObjType;
        const createdBy = courseObj.createdBy as unknown as CreatedByPopulated;
        const shapedObj = {
          id: String(courseObj._id),
          title: courseObj.title,
          status: courseObj.status,
          verificationStatus: courseObj.verificationStatus,
          category: {
            id: String(category._id),
            name: category.name,
          },
          skillLevel: courseObj.skillLevel,
          price: courseObj.price,
          type: courseObj.type,
          description: courseObj.description,
          createdBy: {
            id: createdBy?._id ? String(createdBy._id) : "",
            name: createdBy?.name ?? "",
            role: createdBy?.role ?? "",
          },
          createdAt: courseObj.createdAt,
          chapterCount: courseObj.chapterCount,
          thumbnailUrl: thumbnailUrl ?? "",
        };

        return courseDetailsSchema.parse(shapedObj);
      }),
    );

    return { courseData: mappedResponse, TotalCourseCount: totalCourseCount };
  }

  /**
   *
   * @param courseId
   * @returns
   */

  /**
   *
   * @param courseId
   */

  async approveCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.verificationStatus = "approved";
    await courseData.save();
  }

  /**
   *
   * @param courseId
   * @param reason
   */

  async rejectCourse(courseId: string, reason: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.verificationStatus = "rejected";
    courseData.rejectReason = reason;
    await courseData.save();
  }

  /**
   *
   * @param courseId
   * @param reason
   */

  async blockCourse(courseId: string, reason: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.isBlocked = true;
    courseData.blockedReason = reason;
    await courseData.save();
  }

  /**
   *
   * @param courseId
   */

  async unblockCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.isBlocked = false;
    courseData.blockedReason = "";
    await courseData.save();
  }
}
