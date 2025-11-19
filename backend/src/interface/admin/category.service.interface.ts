import { CategoryCreateDtoType } from "@/schema/admin/category/category.create.schema";
import { ListCategoryFilterType } from "@/schema/admin/category/category.list.schema";
import { CategoryDto } from "@/schema/admin/category/category.response.schema";
import { CategoryUpdateDtoType } from "@/schema/admin/category/category.update.schema";

export interface ICategoryService {
  createCategory(payload: CategoryCreateDtoType): Promise<CategoryDto>;

  updateCategory(id: string, payload: CategoryUpdateDtoType): Promise<CategoryDto>;

  blockCategory(id: string): Promise<void>;

  unblockCategory(id: string): Promise<void>;

  listCategories(
    filters?: ListCategoryFilterType,
  ): Promise<{ category: CategoryDto[]; total: number }>;
}
