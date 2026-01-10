import { IBaseRepo } from "@/repos/shared/base";
import { FlattenMaps } from "mongoose";
import { CategoryListArgs } from "./category.repo.interface";
import { ISubcategory } from "@/model/shared/SubCategory";

export interface ISubCategoryRepo extends IBaseRepo<ISubcategory> {
  list: ({
    query,
    limit,
    skip,
    sort,
  }: CategoryListArgs) => Promise<Array<FlattenMaps<ISubcategory>>>;
  count: (query: any) => Promise<number>;
}
