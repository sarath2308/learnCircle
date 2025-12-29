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

  async updateThumbnail(id: string, key: string): Promise<void> {
    await this._model.updateOne({ id }, { $set: { thumbnail_key: key } });
  }

  async getCourseWithTitle(title: string): Promise<ICourse | null> {
    return await this._model.findOne({ title: title, isDeleted: false });
  }
}
