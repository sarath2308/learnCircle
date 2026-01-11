import { SubCategoryCreateDtoType } from "@/schema/shared/category/sub/sub.category.create";
import { ListSubCategoryFilterType } from "@/schema/shared/category/sub/sub.category.list";
import { SubCategoryDto } from "@/schema/shared/category/sub/sub.category.response";
import { SubCategoryUpdateDtoType } from "@/schema/shared/category/sub/sub.category.update";
import { SubCategoryUserResponseType } from "@/schema/shared/category/sub/sub.category.user.response";

export interface ISubCategoryService {
  createCategory(payload: SubCategoryCreateDtoType): Promise<void>;

  updateCategory(id: string, payload: SubCategoryUpdateDtoType): Promise<void>;

  blockCategory(id: string): Promise<void>;

  unblockCategory(id: string): Promise<void>;

  listCategoryForAdmin(
    filters?: ListSubCategoryFilterType,
  ): Promise<{ category: SubCategoryDto[]; total: number }>;

  getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategoryUserResponseType[] | []>;
}
