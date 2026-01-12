import { HttpStatus } from "@/constants/shared/httpStatus";
import { LESSON_TYPES } from "@/constants/shared/lessonType";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { adminChapterResponse } from "@/schema/admin/course/chapter.response";
import {
  CourseDetailsResponseType,
  courseDetailsSchema,
} from "@/schema/admin/course/course.details";
import { adminLessonResponseSchema } from "@/schema/admin/course/lesson.response";
import { AdminCourseDetailsResponse } from "@/types/admin/course/admin.course.manage.type";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

type CreatedByPopulated = {
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
          category: category.name,
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

  async getCourseDetails(courseId: string): Promise<AdminCourseDetailsResponse> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let thumbnailUrl: string | null = null;

    if (courseData.thumbnail_key) {
      thumbnailUrl = await this._s3Service.getFileUrl(courseData.thumbnail_key);
    }
    const createdBy = courseData.createdBy as unknown as CreatedByPopulated;
    const category = courseData.category as unknown as CategoryObjType;
    const courseObj = {
      ...courseData.toObject(),
      id: String(courseData._id),
      category: category.name,
      createdBy: {
        name: createdBy?.name,
        role: createdBy?.role,
      },
      thumbnailUrl,
    };

    const chapters = await this._chapterRepo.getChapters(courseId);

    const baseResponse = {
      ...courseDetailsSchema.parse(courseObj),
      chapters: [],
      chapterCount: 0,
      lessonCount: 0,
    };

    if (chapters.length === 0) {
      return baseResponse;
    }

    const chapterIds = chapters.map((ch) => ch.id);

    const lessons = await this._lessonRepo.getLessonsByChapterIds(chapterIds);

    const lessonsByChapter = new Map<string, any[]>();

    for (const lesson of lessons) {
      const key = lesson.chapterId.toString();
      const arr = lessonsByChapter.get(key) ?? [];
      arr.push(lesson);
      lessonsByChapter.set(key, arr);
    }

    const chapterResponses = await Promise.all(
      chapters.map(async (chapter) => {
        const chapterKey = chapter.id.toString();
        const chapterLessons = lessonsByChapter.get(chapterKey) ?? [];

        const chapterObj = {
          ...chapter.toObject(),
          id: chapter._id,
        };

        const lessonResponses = await Promise.all(
          chapterLessons.map(async (lesson) => {
            let contentUrl: string | null = null;
            let lessonThumbnailUrl: string | null = null;

            if (
              (lesson.type === LESSON_TYPES.VIDEO || lesson.type === LESSON_TYPES.PDF) &&
              lesson.file_key
            ) {
              contentUrl = await this._s3Service.getFileUrl(lesson.file_key);
            }

            // Thumbnail for every lesson (if exists)
            if (lesson.thumbnail_key) {
              lessonThumbnailUrl = await this._s3Service.getFileUrl(lesson.thumbnail_key);
            }

            const lessonObj = {
              ...lesson.toObject(),
              id: lesson._id,
              fileUrl: contentUrl,
              thumbnailUrl: lessonThumbnailUrl,
            };

            return adminLessonResponseSchema.parse(lessonObj);
          }),
        );

        return {
          ...adminChapterResponse.parse(chapterObj),
          lessons: lessonResponses,
          lessonCount: lessonResponses.length,
        };
      }),
    );

    const totalLessons = chapterResponses.reduce((sum, ch) => sum + ch.lessonCount, 0);

    return {
      ...courseDetailsSchema.parse(courseObj),
      chapters: chapterResponses,
      chapterCount: chapterResponses.length,
      lessonCount: totalLessons,
    };
  }

  /**
   *
   * @param courseId
   */

  async approveCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.status = "approved";
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

    courseData.status = "rejected";
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
