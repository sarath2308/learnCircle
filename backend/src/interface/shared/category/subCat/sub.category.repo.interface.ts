import { IBaseRepo } from "@/repos/shared/base";
import { FlattenMaps } from "mongoose";
import { ISubcategory } from "@/model/shared/SubCategory";
import { CategoryListArgs } from "../category.repo.interface";

export interface ISubCategoryRepo extends IBaseRepo<ISubcategory> {
  list: ({
    query,
    limit,
    skip,
    sort,
  }: CategoryListArgs) => Promise<Array<FlattenMaps<ISubcategory>>>;
  count: (query: any) => Promise<number>;

  getSubCategoryByName: (name: string) => Promise<ISubcategory | null>;

  getSubCategoriesByCategoryId: (categoryId: string) => Promise<Array<FlattenMaps<ISubcategory>>>;
}
