import { inject, injectable } from "inversify";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import { ICourse } from "@/model/shared/course.model";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { BaseRepo } from "./base";

@injectable()
export class CourseRepo extends BaseRepo<ICourse> implements ICourseRepo {
  constructor(@inject(TYPES.ICourseModel) private _model: Model<ICourse>) {
    super(_model);
  }

  async updatePrice(
    id: string,
    payload: { price: number; discount: number; type: "Free" | "Paid" },
  ): Promise<void> {
    await this._model.updateOne(
      { id },
      { $set: { price: payload.price, discount: payload.discount, type: payload.type } },
    );
  }

  async updateThumbnail(id: string, key: string): Promise<boolean> {
    const result = await this._model.updateOne({ _id: id }, { $set: { thumbnail_key: key } });

    return result.modifiedCount === 1;
  }

  async getCourseWithTitle(title: string): Promise<ICourse | null> {
    return await this._model.findOne({ title: title, isDeleted: false });
  }

  async increaseChapterCount(courseId: string): Promise<ICourse | null> {
    return await this._model.findByIdAndUpdate(
      courseId,
      { $inc: { chapterCount: 1 } },
      { new: true },
    );
  }

  async decreaseChapterCount(courseId: string): Promise<ICourse | null> {
    return await this._model.findByIdAndUpdate(
      courseId,
      { $inc: { chapterCount: -1 } },
      { new: true },
    );
  }

  async getAllCourse(skip: number, limit: number): Promise<ICourse[] | null> {
    return await this._model
      .find({ status: { $ne: "draft" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("createdBy")
      .populate("category");
  }
  async getTotalCourseCount(): Promise<number> {
    return await this._model.countDocuments({ status: { $ne: "draft" } });
  }
}
