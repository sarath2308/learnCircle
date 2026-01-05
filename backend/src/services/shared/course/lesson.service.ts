import { inject, injectable } from "inversify";
import ILessonService from "@/interface/shared/lesson/lesson.service.interface";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { CreateLessonDto } from "@/schema/shared/lesson/lesson.create.schema";
import { UpdateLessonDto } from "@/schema/shared/lesson/lesson.update.schema";
import { CreateLessonWithVideoDto } from "@/schema/shared/lesson/lesson.create.video.schema";
import mongoose from "mongoose";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { AppError } from "@/errors/app.error";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";
import {
  LessonResponseDto,
  LessonResponseSchema,
} from "@/schema/shared/lesson/lesson.response.schema";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";

@injectable()
export class LessonService implements ILessonService {
  constructor(
    @inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
  ) {}
  /**
   *
   * @param chapterId
   * @param userId
   * @param lessonDto
   * @param resourceData
   * @param thumbnailData
   * @returns
   * creating lessons data other than video lessons
   */
  async createLesson(
    chapterId: string,
    userId: string,
    lessonDto: CreateLessonDto,
    resourceData: UploadedFile,
    thumbnailData: UploadedFile,
  ): Promise<LessonResponseDto> {
    const present = await this._lessonRepo.findLessonByTitleAndChapterId(
      lessonDto.title,
      chapterId,
    );

    if (present) {
      throw new AppError(Messages.LESSON_DUPLICATE, HttpStatus.BAD_REQUEST);
    }

    const chapterObjectId = new mongoose.Types.ObjectId(chapterId);

    const lessonData = await this._lessonRepo.create({ ...lessonDto, chapterId: chapterObjectId });

    if (!lessonData) {
      throw new AppError(Messages.LESSON_NOT_CREATED, HttpStatus.BAD_REQUEST);
    }

    await this._chapterRepo.increseLessonCount(String(lessonData._id));

    const thumbnail_key = await this._s3Service.generateS3Key(userId, thumbnailData.originalName);

    const thumbnailUrl = await this._s3Service.uploadFileFromStream(
      thumbnailData.path,
      thumbnail_key,
      thumbnailData.mimeType,
      60,
    );

    lessonData.thumbnail_key = thumbnail_key;

    let fileUrl = "";
    if (lessonDto.type === "PDF") {
      const file_key = await this._s3Service.generateS3Key(userId, resourceData.originalName);

      fileUrl = await this._s3Service.uploadFileFromStream(
        resourceData.path,
        file_key,
        resourceData.mimeType,
        60,
      );
      lessonData.file_key = file_key;
    }
    await lessonData.save();
    const lessonObject = lessonData.toObject();

    const lessonDataWithUrls = {
      ...lessonObject,

      // ✅ serialize Mongo fields
      id: lessonObject._id.toString(),
      chapterId: lessonObject.chapterId.toString(),
      createdAt: lessonObject.createdAt.toISOString(),
      updatedAt: lessonObject.updatedAt.toISOString(),

      // computed fields
      thumbnailUrl,
      fileUrl: fileUrl || undefined,
    };

    return LessonResponseSchema.parse(lessonDataWithUrls);
  }
  /**
   *
   * @param lessonId
   * @returns
   */
  async getLessonById(lessonId: string): Promise<LessonResponseDto> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new AppError(Messages.LESSON_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    let fileUrl = "";
    let thumbnailUrl = "";
    if (lesson.file_key) {
      fileUrl = await this._s3Service.getFileUrl(lesson.file_key, 60);
    }
    if (lesson.thumbnail_key) {
      thumbnailUrl = await this._s3Service.getFileUrl(lesson.thumbnail_key, 60);
    }
    const lessonDataWithUrls = {
      ...lesson.toObject(),
      id: lesson._id,
      thumbnailUrl,
      chapterId: String(lesson.chapterId),
      fileUrl: fileUrl ? fileUrl : undefined,
    };

    return LessonResponseSchema.parse(lessonDataWithUrls);
  }

  /**
   *
   * @param lessonId
   * @param lessonDto
   * @returns
   */

  async updateLesson(lessonId: string, lessonDto: UpdateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new AppError(Messages.LESSON_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const updated = await this._lessonRepo.update(lessonId, lessonDto);
    if (!updated) {
      throw new AppError(Messages.LESSON_NOT_UPDATED, HttpStatus.NOT_MODIFIED);
    }
    let fileUrl = "";
    let thumbnailUrl = "";
    if (updated.file_key) {
      fileUrl = await this._s3Service.getFileUrl(updated.file_key, 60);
    }
    if (updated.thumbnail_key) {
      thumbnailUrl = await this._s3Service.getFileUrl(updated.thumbnail_key, 60);
    }
    const lessonDataWithUrls = {
      ...updated.toObject(),
      id: updated._id,
      thumbnailUrl,
      chapterId: String(updated.chapterId),
      fileUrl: fileUrl ? fileUrl : undefined,
    };
    return LessonResponseSchema.parse(lessonDataWithUrls);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new AppError(Messages.LESSON_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this._lessonRepo.delete(lessonId);
    await this._chapterRepo.decreaseLessonCount(lessonId);
  }

  async changeLessonOrder(chapterId: string, lessonOrderDto: any): Promise<void> {}

  /**
   *
   * @param chapterId
   * @param userId
   * @param lessonDto
   * @param thumbnailData
   * @returns
   */

  async createLessonWithVideo(
    chapterId: string,
    userId: string,
    lessonDto: CreateLessonWithVideoDto,
    thumbnailData: UploadedFile,
  ): Promise<{ preSignedUrl: string; lessonId: string }> {
    const present = await this._lessonRepo.findLessonByTitleAndChapterId(
      lessonDto.title,
      chapterId,
    );

    if (present) {
      throw new AppError(Messages.LESSON_DUPLICATE, HttpStatus.BAD_REQUEST);
    }

    const chapterObjectId = new mongoose.Types.ObjectId(chapterId);

    const lessonData = await this._lessonRepo.create({ ...lessonDto, chapterId: chapterObjectId });

    if (!lessonData) {
      throw new AppError(Messages.LESSON_NOT_CREATED, HttpStatus.BAD_REQUEST);
    }

    const thumbnail_key = await this._s3Service.generateS3Key(
      chapterId,
      thumbnailData.originalName,
    );

    const file_key = await this._s3Service.generateS3Key(chapterId, lessonDto.originalFileName);

    await this._s3Service.uploadFileFromStream(
      thumbnailData.path,
      thumbnail_key,
      thumbnailData.mimeType,
      60,
    );

    lessonData.thumbnail_key = thumbnail_key;
    lessonData.file_key = file_key;
    lessonData.mediaStatus = "pending";

    const presignedUrl = await this._s3Service.generatePresignedPutUrl(
      userId,
      lessonDto.originalFileName,
      lessonDto.mimeType,
    );
    lessonData.file_key = presignedUrl.key;

    await lessonData.save();
    return {
      preSignedUrl: presignedUrl.uploadUrl,
      lessonId: String(lessonData._id),
    };
  }
  async finalizeLessonVideo(lessonId: string): Promise<LessonResponseDto> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new AppError(Messages.LESSON_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    lesson.mediaStatus = "ready";
    await lesson.save();
    let fileUrl = "";
    let thumbnailUrl = "";
    if (lesson.file_key) {
      fileUrl = await this._s3Service.getFileUrl(lesson.file_key, 60);
    }
    if (lesson.thumbnail_key) {
      thumbnailUrl = await this._s3Service.getFileUrl(lesson.thumbnail_key, 60);
    }
    const lessonObject = lesson.toObject();

    const lessonDataWithUrls = {
      ...lessonObject,

      // ✅ serialize Mongo fields
      id: lessonObject._id.toString(),
      chapterId: lessonObject.chapterId.toString(),
      createdAt: lessonObject.createdAt.toISOString(),
      updatedAt: lessonObject.updatedAt.toISOString(),

      // computed fields
      thumbnailUrl,
      fileUrl: fileUrl || undefined,
    };

    return LessonResponseSchema.parse(lessonDataWithUrls);
  }
}
