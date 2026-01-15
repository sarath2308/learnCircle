import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICompressor } from "@/interface/shared/compressor.interface";
import ICourseRepo, { CourseStatus } from "@/interface/shared/course/course.repo.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";
import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import {
  courseResponseSchema,
  courseResponseType,
} from "@/schema/shared/course/course.response.schema";
import { ISafeDeleteService } from "@/utils/safe.delete.service";
import {
  courseManageResponseSchema,
  courseManageResponseType,
} from "@/schema/shared/course/course.manage.response.schema";
import { CategoryObjType, CreatedByPopulated } from "@/services/admin/admin.course.manage.service";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import { CreatorCourseViewResponse } from "@/types/admin/course/admin.course.manage.type";
import { courseDetailsSchema } from "@/schema/admin/course/course.details";
import { LESSON_TYPES } from "@/constants/shared/lessonType";
import { adminLessonResponseSchema } from "@/schema/admin/course/lesson.response";
import { adminChapterResponse } from "@/schema/admin/course/chapter.response";
import {
  userCourseCardResponseSchema,
  type userCourseCardResponseType,
} from "@/schema/learner/course/course.home.response";
import { CoursePopulated } from "@/types/learner/course/course.home.card.type";

@injectable()
export class CourseService implements ICourseService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.ImageCompressService) private _imageCompressService: ICompressor,
    @inject(TYPES.ISafeDeleteService) private _safeDeleteService: ISafeDeleteService,
    @inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo,
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
  ) {}
  //creating a course
  /**
   *
   * @param data
   * @param thumbnail
   * @returns
   */
  async createCourse(
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ): Promise<{ courseId: string }> {
    let compressedPath: string | null = null;

    try {
      const present = await this._courseRepo.getCourseWithTitle(data.title);
      if (present) {
        throw new AppError(Messages.COURSE_DUPLICATE, HttpStatus.BAD_REQUEST);
      }
      let subCategoryId: mongoose.Types.ObjectId | undefined = undefined;
      if (data.subCategory) {
        subCategoryId = new mongoose.Types.ObjectId(data.subCategory);
      }
      const categoryObjectId = new mongoose.Types.ObjectId(data.category);

      const createdCourse = await this._courseRepo.create({
        ...data,
        category: categoryObjectId,
        subCategory: subCategoryId,
      });

      if (!createdCourse) {
        throw new AppError(Messages.COURSE_NOT_CREATED, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const courseId = String(createdCourse._id);

      compressedPath = await this._imageCompressService.compress(thumbnail.path);
      console.log("COMPRESSED PATH:", compressedPath);
      const key = await this._s3Service.generateS3Key(courseId, thumbnail.originalName);
      console.log("GENERATED KEY:", key);
      await this._s3Service.uploadFileFromStream(
        compressedPath,
        key,
        thumbnail.mimeType,
        Number(process.env.S3_URL_EXPIRES_IN),
      );

      await this._courseRepo.updateThumbnail(courseId, key);

      return { courseId };
    } finally {
      await this._safeDeleteService.safeDelete(thumbnail.path);
      if (compressedPath) {
        await this._safeDeleteService.safeDelete(compressedPath);
      }
    }
  }

  /**
   *
   * @param courseId
   * @param payload
   */
  async editCourse(courseId: string, payload: Partial<createCourseDtoType>): Promise<void> {
    const categoryObjectId = new mongoose.Types.ObjectId(payload.category);
    let subCategoryId: mongoose.Types.ObjectId | undefined = undefined;
    if (payload.subCategory) {
      subCategoryId = new mongoose.Types.ObjectId(payload.subCategory);
    }
    let updated = await this._courseRepo.update(courseId, {
      ...payload,
      category: categoryObjectId,
      subCategory: subCategoryId,
    });
    if (!updated) {
      throw new AppError(Messages.COURSE_NOT_UPDATED, HttpStatus.NOT_MODIFIED);
    }
  }

  /*updating course price details*/
  /**
   *
   * @param id
   * @param data
   */
  async updatePriceDetails(id: string, data: CoursePriceDtoType): Promise<void> {
    const courseData = await this._courseRepo.findById(id);
    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (data.type === "Paid") {
      await this._courseRepo.updatePrice(id, {
        price: Number(data.price || 0),
        discount: Number(data.discount || 0),
        type: data.type,
      });
    }
    if (data.status === "published") {
      courseData.status = "published";
      await courseData.save();
    }
  }

  async publishCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);
    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    courseData.status = "published";
    await courseData.save();
  }
  /**
   *
   * @param courseId
   * @returns
   */
  async getCourseDataForCourseCreation(courseId: string): Promise<courseResponseType> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const responseObject = {
      ...courseData,
      id: courseData._id,
    };
    return courseResponseSchema.parse(responseObject);
  }
  /**
   *
   * @returns
   */
  async getAllCourse(): Promise<any> {
    return await this._courseRepo.getAll();
  }
  /**
   *
   * @returns
   */
  async getCourseDataForUserHome(): Promise<userCourseCardResponseType[]> {
    const courseData: CoursePopulated[] = await this._courseRepo.getAllCourseForUserHome();

    if (!courseData.length) return [];

    const results = await Promise.allSettled(
      courseData.map(async (course) => {
        try {
          // thumbnail
          let thumbnailUrl = "";
          if (course.thumbnail_key) {
            thumbnailUrl = await this._s3Service.getFileUrl(
              course.thumbnail_key,
              Number(process.env.S3_URL_EXPIRES_IN),
            );
          }

          // hard validation — course must be correctly populated
          if (!course.category || typeof course.category !== "object") {
            throw new Error("Course category not populated");
          }

          if (!course.createdBy || typeof course.createdBy !== "object") {
            throw new Error("Course createdBy not populated");
          }

          const responseObject: userCourseCardResponseType = {
            id: String(course._id),
            title: course.title,
            description: course.description,
            type: course.type,
            thumbnailUrl,
            createdAt: String(course.createdAt),

            category: {
              id: String(course.category._id),
              name: course.category.name,
            },

            subCategory: course.subCategory
              ? {
                  id: String(course.subCategory._id),
                  name: course.subCategory.name,
                }
              : undefined,

            skillLevel: course.skillLevel,

            price: course.type === "Free" ? 0 : course.price,
            discount: course.type === "Free" ? 0 : course.discount,

            createdBy: {
              id: String(course.createdBy._id),
              name: course.createdBy.name,
              role: course.createdBy.role,
            },

            chapterCount: 4,
            averageRating: 4,
          };

          // final runtime validation
          return userCourseCardResponseSchema.parse(responseObject);
        } catch (error) {
          console.error(`[USER_HOME_COURSE_SKIP] courseId=${course._id}`, error);
          return null;
        }
      }),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<userCourseCardResponseType> =>
          r.status === "fulfilled" && r.value !== null,
      )
      .map((r) => r.value);
  }

  /**
   *
   * @param userId
   * @param status
   * @returns
   */
  async getCouseDataForCourseManagement(
    userId: string,
    status?: CourseStatus,
  ): Promise<courseManageResponseType[]> {
    const courseData = await this._courseRepo.getCourseDataFromUserId(userId, { status });
    if (courseData.length === 0) {
      return [];
    }
    return Promise.all(
      courseData.map(async (course) => {
        let thumbnailUrl = null;
        if (course.thumbnail_key) {
          thumbnailUrl = await this._s3Service.getFileUrl(
            course.thumbnail_key,
            Number(process.env.S3_URL_EXPIRES_IN),
          );
        }

        const category = course.category as unknown as CategoryObjType;
        const responseObject = {
          ...course,
          id: String(course._id),
          title: course.title,
          status: course.status,
          type: course.type,
          thumbnail: thumbnailUrl ?? "",
          createdAt: String(course.createdAt),
          category: category.name,
          price: course.type === "Free" ? 0 : course.price,
          discount: course.type === "Free" ? 0 : course.discount,
          skillLevel: course.skillLevel,
          verificationStatus: course.verificationStatus,
        };
        return courseManageResponseSchema.parse(responseObject);
      }),
    );
  }

  /**
   *
   * @param courseId
   * @returns
   */

  async getCourseById(courseId: string): Promise<courseResponseType> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const responseObject = {
      ...courseData,
      id: courseData._id,
    };
    return courseResponseSchema.parse(responseObject);
  }

  /**
   *
   * @param courseId
   * @returns
   */

  async getCourseDataForCreatorView(courseId: string): Promise<CreatorCourseViewResponse> {
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
      rejectReason: courseData.rejectReason ?? "",
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
          id: String(chapter._id),
          title: chapter.title,
          description: chapter.description,
          order: chapter.order,
          lessonCount: chapterLessons.length,
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
              id: String(lesson._id),
              chapterId: String(lesson.chapterId),
              fileUrl: contentUrl ?? "",
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
}
