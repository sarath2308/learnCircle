import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import { IChapterService } from "@/interface/shared/chapter/chapter.service.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import { CreateChapterType } from "@/schema/shared/chapter/chapter.create.schema";
import { EditChapterType } from "@/schema/shared/chapter/chapter.edit.schema";
import {
  chapterResponseSchema,
  ChapterResponseType,
} from "@/schema/shared/chapter/chapter.response.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class ChapterService implements IChapterService {
  constructor(
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
  ) {}

  /**
   *
   * @param courseId
   * @param data
   * @returns
   */

  async createChapter(courseId: string, data: CreateChapterType): Promise<ChapterResponseType> {
    console.log("Creating chapter for courseId:", courseId, "with data:", data);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const present = await this._chapterRepo.getChapterWithTitle(data.title, courseId);

    if (present) {
      throw new AppError(Messages.CHAPTER_DUPLICATE, HttpStatus.BAD_REQUEST);
    }

    let chapter = await this._chapterRepo.create({ ...data, courseId: courseObjectId });

    if (!chapter) {
      throw new AppError(Messages.CHAPTER_NOT_CREATED, HttpStatus.NOT_IMPLEMENTED);
    }

    await this._courseRepo.increaseChapterCount(String(chapter._id));

    chapter = chapter.toObject();
    const responseObj = {
      id: chapter._id.toString(),
      title: chapter.title,
      description: chapter.description,
      order: chapter.order,
      courseId: chapter.courseId.toString(),
      isPublished: chapter.isPublished ?? false,
    };

    return chapterResponseSchema.parse(responseObj);
  }

  /**
   *
   * @param chapterId
   * @param data
   * @returns
   */

  async editChapter(chapterId: string, data: EditChapterType): Promise<ChapterResponseType> {
    let updatedData = await this._chapterRepo.update(chapterId, data);

    if (!updatedData) {
      throw new AppError(Messages.CHAPTER_NOT_UPDATED, HttpStatus.NOT_FOUND);
    }

    const responseObj = {
      ...updatedData,
      id: updatedData._id,
    };

    return chapterResponseSchema.parse(responseObj);
  }

  /**
   *
   * @param chapterId
   */

  async removeChapter(chapterId: string): Promise<void> {
    await this._chapterRepo.remove(chapterId);
    await this._courseRepo.decreaseChapterCount(chapterId);
  }

  async getChapter(chapterId: string): Promise<ChapterResponseType> {
    const chapterData = await this._chapterRepo.findById(chapterId);

    if (!chapterData) {
      throw new AppError(Messages.CHAPTER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const responseObj = {
      ...chapterData,
      id: chapterData._id,
    };

    return chapterResponseSchema.parse(responseObj);
  }

  async getChapters(courseId: string): Promise<ChapterResponseType[]> {
    const chapters = await this._chapterRepo.getChapters(courseId);

    if (!chapters) {
      throw new AppError(Messages.CHAPTERS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const responseData = chapters.map((chapterData) => {
      const responseObj = {
        ...chapterData,
        id: chapterData._id,
      };

      return chapterResponseSchema.parse(responseObj);
    });

    return responseData;
  }
}
