import { ICategory } from "@/model/shared/Category";
import { BaseRepo } from "../shared/base";
import {
  CategoryListArgs,
  ICategoryRepo,
} from "@/interface/shared/category/category.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { FlattenMaps, Model } from "mongoose";

@injectable()
export class CategoryRepo extends BaseRepo<ICategory> implements ICategoryRepo {
  constructor(@inject(TYPES.ICategoryModel) private _model: Model<ICategory>) {
    super(_model);
  }
  async list({
    query,
    limit,
    skip,
    sort,
  }: CategoryListArgs): Promise<Array<FlattenMaps<ICategory>>> {
    return await this._model.find(query).sort(sort).skip(skip).limit(limit).lean();
  }
  async count(query: any): Promise<number> {
    return await this._model.find(query).countDocuments();
  }

  async getAll(): Promise<(ICategory & Document)[]> {
    return await this._model.find({ isBlocked: false });
  }
}
