import { IChapter } from "@/model/shared/chapter.model";
import { BaseRepo } from "./base";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
@injectable()
export class ChapterRepo extends BaseRepo<IChapter> implements IChapterRepo {
  constructor(@inject(TYPES.IChapterModel) private _model: Model<IChapter>) {
    super(_model);
  }

  async remove(id: string): Promise<void> {
    await this._model.updateOne({ id }, { $set: { isDeleted: true } });
  }

  async getChapters(courseId: string): Promise<IChapter[]> {
    return await this._model.find({ courseId: courseId });
  }

  async getChapterWithTitle(title: string, courseId: string): Promise<IChapter | null> {
    return await this._model.findOne({ title: title, isDeleted: false, courseId: courseId });
  }

  async increseLessonCount(chapterId: string): Promise<IChapter | null>{
     return await this._model.findByIdAndUpdate(
    chapterId,
    { $inc: { lessonCount: 1 } },
    { new: true } 
  );
  }

   async decreaseLessonCount(chapterId: string): Promise<IChapter | null>{
     return await this._model.findByIdAndUpdate(
    chapterId,
    { $inc: { lessonCount: -1 } },
    { new: true } 
  );
  }
}
