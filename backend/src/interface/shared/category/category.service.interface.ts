import { CategoryCreateDtoType } from "@/schema/shared/category/category.create.schema";
import { ListCategoryFilterType } from "@/schema/shared/category/category.list.schema";
import { CategoryDto } from "@/schema/shared/category/category.response.schema";
import { CategoryUpdateDtoType } from "@/schema/shared/category/category.update.schema";

export interface ICategoryService {
  createCategory(payload: CategoryCreateDtoType): Promise<CategoryDto>;

  updateCategory(id: string, payload: CategoryUpdateDtoType): Promise<CategoryDto>;

  blockCategory(id: string): Promise<void>;

  unblockCategory(id: string): Promise<void>;

  listCategoryForAdmin(
    filters?: ListCategoryFilterType,
  ): Promise<{ category: CategoryDto[]; total: number }>;

  getCategoryForUser: () => Promise<CategoryDto[]>;
}
