import { IChapter } from "@/model/shared/chapter.model";
import { BaseRepo } from "./base";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import mongoose, { Model } from "mongoose";
@injectable()
export class ChapterRepo extends BaseRepo<IChapter> implements IChapterRepo {
  constructor(@inject(TYPES.IChapterModel) private _model: Model<IChapter>) {
    super(_model);
  }

  async removeChapter(chapterId: string): Promise<void> {
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const chapter = await this._model.findOne({ _id: chapterId, isDeleted: false }, null, {
        session,
      });

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      const { courseId, order } = chapter;

      // 1. Soft delete the chapter
      await this._model.updateOne({ _id: chapterId }, { $set: { isDeleted: true } }, { session });

      // 2. Reorder remaining chapters
      await this._model.updateMany(
        {
          courseId,
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

  async getChapters(courseId: string): Promise<IChapter[]> {
    return await this._model.find({ courseId: courseId });
  }

  async getChapterWithTitle(title: string, courseId: string): Promise<IChapter | null> {
    return await this._model.findOne({ title: title, isDeleted: false, courseId: courseId });
  }

  async increseLessonCount(chapterId: string): Promise<IChapter | null> {
    return await this._model.findByIdAndUpdate(
      chapterId,
      { $inc: { lessonCount: 1 } },
      { new: true },
    );
  }

  async decreaseLessonCount(chapterId: string): Promise<IChapter | null> {
    return await this._model.findByIdAndUpdate(
      chapterId,
      { $inc: { lessonCount: -1 } },
      { new: true },
    );
  }

  async findById(chapterId: string): Promise<IChapter | null> {
    return await this._model.findOne({ _id: chapterId, isDeleted: false });
  }
}
