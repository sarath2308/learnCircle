import { ICategory } from "@/model/shared/Category";
import { IBaseRepo } from "@/repos/shared/base";
import { FlattenMaps } from "mongoose";

export interface CategoryListArgs {
  query: Record<string, any>;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export interface ICategoryRepo extends IBaseRepo<ICategory> {
  list: ({ query, limit, skip, sort }: CategoryListArgs) => Promise<Array<FlattenMaps<ICategory>>>;
  count: (query: any) => Promise<number>;
  getAll: () => Promise<ICategory[]>;
  getCategoryByName: (name: string) => Promise<ICategory | null>;
}
