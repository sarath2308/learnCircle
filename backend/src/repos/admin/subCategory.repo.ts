import { BaseRepo } from "../shared/base";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { FlattenMaps, Model } from "mongoose";
import { ISubcategory } from "@/model/shared/SubCategory";
import { ISubCategoryRepo } from "@/interface/shared/category/subCat/sub.category.repo.interface";
import { CategoryListArgs } from "@/interface/shared/category/category.repo.interface";

@injectable()
export class SubCategoryRepo extends BaseRepo<ISubcategory> implements ISubCategoryRepo {
  constructor(@inject(TYPES.ISubCategoryModel) private _model: Model<ISubcategory>) {
    super(_model);
  }
  async create(payload: Partial<ISubcategory>): Promise<ISubcategory> {
    const newSubCategory = new this._model(payload);
    return await newSubCategory.save();
  }
  async list({
    query,
    limit,
    skip,
    sort,
  }: CategoryListArgs): Promise<Array<FlattenMaps<ISubcategory>>> {
    return await this._model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("categoryId")
      .lean();
  }
  async count(query: any): Promise<number> {
    return await this._model.find(query).countDocuments();
  }

  async getSubCategoryByName(name: string): Promise<ISubcategory | null> {
    return await this._model.findOne({
      name: { $regex: name, $options: "i" },
    });
  }
  async getSubCategoriesByCategoryId(
    categoryId: string,
  ): Promise<Array<FlattenMaps<ISubcategory>>> {
    return await this._model
      .find({ categoryId: categoryId, isBlocked: false })
      .populate("categoryId")
      .lean();
  }
}
