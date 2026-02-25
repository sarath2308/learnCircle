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
import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";
import { LearnerCourseDetailsSchema } from "@/schema/learner/course/learner.course.page.schema";
import { learnerLessonResponseSchema } from "@/schema/learner/course/lesson/learner.lesson.response";
import { learnerChapterResponse } from "@/schema/learner/course/chapter/learner.chapter.response.schema";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";
import { IEnrollmentService } from "@/interface/shared/enroll/enroll.service.interface";

@injectable()
export class CourseService implements ICourseService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.ImageCompressService) private _imageCompressService: ICompressor,
    @inject(TYPES.ISafeDeleteService) private _safeDeleteService: ISafeDeleteService,
    @inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo,
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
    @inject(TYPES.IEnrollmentService) private _enrollmentService: IEnrollmentService,
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
      const key = await this._s3Service.generateS3Key(courseId, thumbnail.originalName);
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
  async editCourse(
    courseId: string,
    payload: Partial<createCourseDtoType>,
    thumbnail?: UploadedFile,
  ): Promise<void> {
    let compressedPath: string | null = null;
    let key: string | null = null;

    try {
      const courseData = await this._courseRepo.findById(courseId);

      if (!courseData) {
        throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.BAD_REQUEST);
      }

      let categoryObjectId: mongoose.Types.ObjectId | undefined;
      if (payload.category) {
        if (!mongoose.Types.ObjectId.isValid(payload.category)) {
          throw new AppError("Invalid category id", HttpStatus.BAD_REQUEST);
        }
        categoryObjectId = new mongoose.Types.ObjectId(payload.category);
      }

      let subCategoryObjectId: mongoose.Types.ObjectId | undefined;
      if (payload.subCategory) {
        if (!mongoose.Types.ObjectId.isValid(payload.subCategory)) {
          throw new AppError("Invalid sub category id", HttpStatus.BAD_REQUEST);
        }
        subCategoryObjectId = new mongoose.Types.ObjectId(payload.subCategory);
      }

      if (thumbnail) {
        compressedPath = await this._imageCompressService.compress(thumbnail.path);

        key = await this._s3Service.generateS3Key(courseId, thumbnail.originalName);

        await this._s3Service.uploadFileFromStream(
          compressedPath,
          key,
          thumbnail.mimeType,
          Number(process.env.S3_URL_EXPIRES_IN),
        );
      }

      courseData.title = payload.title ?? courseData.title;
      courseData.description = payload.description ?? courseData.description;
      courseData.category = categoryObjectId ?? courseData.category._id;
      courseData.subCategory = subCategoryObjectId ?? courseData.subCategory?._id;
      courseData.skillLevel = payload.skillLevel ?? courseData.skillLevel;
      courseData.thumbnail_key = key ?? courseData.thumbnail_key;
      courseData.price = payload.price ? Number(payload.price) : courseData.price;
      courseData.discount = payload.discount ? Number(payload.discount) : courseData.discount;

      await courseData.save();
    } finally {
      if (thumbnail) {
        await this._safeDeleteService.safeDelete(thumbnail.path);

        if (compressedPath) {
          await this._safeDeleteService.safeDelete(compressedPath);
        }
      }
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
  async getAllCourseForUser(
    filter: LearnerAllCourseRequestType,
  ): Promise<userCourseCardResponseType[] | []> {
    const courseData: CoursePopulated[] = await this._courseRepo.getAllCourseForUser(filter);

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

          const chapters = await this._chapterRepo.getChapters(String(course._id));

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

            chapterCount: chapters.length ?? 0,
            averageRating: course.averageRating ?? 0,
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

          const chapters = await this._chapterRepo.getChapters(String(course._id));

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

            chapterCount: chapters.length ?? 0,
            averageRating: course.averageRating ?? 0,
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
    filter: {
      status?: CourseStatus;
      search?: string;
      type?: string;
      category?: string;
      subCategory?: string;
      rating?: string;
      skillLevel?: string;
    },
  ): Promise<courseManageResponseType[]> {
    const courseData = await this._courseRepo.getCourseDataFromUserId(userId, filter);

    if (courseData.length === 0) {
      return [];
    }

    console.log("course data" + courseData);

    return Promise.all(
      courseData.map(async (course) => {
        let thumbnailUrl = "";

        if (course.thumbnail_key) {
          thumbnailUrl = await this._s3Service.getFileUrl(
            course.thumbnail_key,
            Number(process.env.S3_URL_EXPIRES_IN),
          );
        }

        const categoryDoc =
          course.category && typeof course.category === "object"
            ? (course.category as unknown as CategoryObjType)
            : null;

        const responseObject = {
          id: String(course._id),
          title: course.title,
          status: course.status,
          type: course.type,
          thumbnail: thumbnailUrl,
          createdAt: String(course.createdAt),
          category: categoryDoc?.name ?? "",
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

    let thumbnailUrl = "";

    if (courseData.thumbnail_key) {
      thumbnailUrl = await this._s3Service.getFileUrl(courseData.thumbnail_key);
    }

    // 🔒 Enforce mandatory category invariant
    if (!courseData.category) {
      throw new AppError(
        "Course data corrupted: category is missing",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const category = courseData.category as unknown as CategoryObjType;

    const responseObject = {
      id: String(courseData._id),
      title: courseData.title,
      description: courseData.description,

      category: String(category._id),

      subCategory:
        courseData.subCategory && typeof courseData.subCategory === "object"
          ? String(courseData.subCategory._id)
          : null,

      skillLevel: courseData.skillLevel,
      thumbnailUrl,
      type: courseData.type,
      status: courseData.status,
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
      category: {
        name: category.name,
        id: String(category._id),
      },
      createdBy: {
        name: createdBy?.name,
        role: createdBy?.role,
      },
      discount: courseData.discount ?? 0,
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

  async getCourseDataForLearner(userId: string, courseId: string): Promise<LearnerCourseResponse> {
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

    //checking if the user is enrolled
    const isEnrolled = await this._enrollmentService.isEnrolled(userId, courseId);

    const courseObj = {
      ...courseData.toObject(),
      id: String(courseData._id),
      category: {
        name: category.name,
        id: String(category._id),
      },
      createdBy: {
        name: createdBy?.name,
        role: createdBy?.role,
      },
      discount: courseData.discount ?? 0,
      thumbnailUrl,
      rejectReason: courseData.rejectReason ?? "",
      isEnrolled: isEnrolled,
    };

    const chapters = await this._chapterRepo.getChapters(courseId);

    const baseResponse = {
      ...LearnerCourseDetailsSchema.parse(courseObj),
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

            return learnerLessonResponseSchema.parse(lessonObj);
          }),
        );

        return {
          ...learnerChapterResponse.parse(chapterObj),
          lessons: lessonResponses,
          lessonCount: lessonResponses.length,
        };
      }),
    );

    const totalLessons = chapterResponses.reduce((sum, ch) => sum + ch.lessonCount, 0);

    return {
      ...LearnerCourseDetailsSchema.parse(courseObj),
      chapters: chapterResponses,
      chapterCount: chapterResponses.length,
      lessonCount: totalLessons,
    };
  }

  async updateAverageRating(courseId: string, rating: number): Promise<void> {
    await this._courseRepo.updateRating(courseId, rating);
  }
}
