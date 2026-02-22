import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { TYPES } from "@/types/shared/inversify/types";
import { Model, Types } from "mongoose";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { ILesson } from "@/model/shared/lesson.model";

@injectable()
export class LessonRepo extends BaseRepo<ILesson> implements ILessonRepo {
  constructor(@inject(TYPES.ILessonModel) private _model: Model<ILesson>) {
    super(_model);
  }
  async findLessonsByChapterId(chapterId: string): Promise<ILesson[]> {
    return this._model.find({ chapterId, isDeleted: false }).sort({ order: 1 }).exec();
  }
  async findLessonByTitleAndChapterId(title: string, chapterId: string): Promise<ILesson | null> {
    return this._model.findOne({ title, chapterId, isDeleted: false }).exec();
  }
  async updateLessonMediaStatus(
    lessonId: string,
    status: "ready" | "pending" | "uploaded" | "failed",
  ): Promise<void> {
    await this._model.updateOne({ _id: lessonId }, { mediaStatus: status }).exec();
  }
  async updateThumbnailKey(lessonId: string, thumbnailKey: string): Promise<void> {
    await this._model.updateOne({ _id: lessonId }, { thumbnail_key: thumbnailKey }).exec();
  }
  async findById(id: string): Promise<ILesson | null> {
    return this._model.findOne({ _id: id, isDeleted: false }).exec();
  }

  async getLessonsByChapterIds(chapterArray: Array<string>): Promise<ILesson[]> {
    return await this._model.find({ chapterId: { $in: [...chapterArray] }, isDeleted: false });
  }

  async findDuplicateWithSameTitle(
    lessonId: string,
    chapterId: string,
    title: string,
  ): Promise<ILesson | null> {
    return this._model.findOne({
      _id: { $ne: new Types.ObjectId(lessonId) },
      chapterId: new Types.ObjectId(chapterId),
      isDeleted: false,
      title,
    });
  }

  async removeLesson(lessonId: string): Promise<void> {
    const session = await this._model.startSession();

    await session.withTransaction(async () => {
      const lesson = await this._model.findOne({ _id: lessonId, isDeleted: false }, null, {
        session,
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      const { chapterId, order } = lesson;

      // 1. Soft delete the lesson
      await this._model.updateOne({ _id: lessonId }, { $set: { isDeleted: true } }, { session });

      // 2. Shift remaining lessons
      await this._model.updateMany(
        {
          chapterId,
          isDeleted: false,
          order: { $gt: order },
        },
        {
          $inc: { order: -1 },
        },
        { session },
      );
    });

    session.endSession();
  }
}
