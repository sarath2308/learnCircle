import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICategoryRepo } from "@/interface/admin/category.repo.interface";
import { ICategoryService } from "@/interface/admin/category.service.interface";
import { CategoryCreateDtoType } from "@/schema/admin/category/category.create.schema";
import { ListCategoryFilterType } from "@/schema/admin/category/category.list.schema";
import { CategoryDto, CategorySchema } from "@/schema/admin/category/category.response.schema";
import { CategoryUpdateDtoType } from "@/schema/admin/category/category.update.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.ICategoryRepo) private _categoryRepo: ICategoryRepo) {}
  /**
   *
   * @param payload
   * @returns
   */
  async createCategory(payload: CategoryCreateDtoType): Promise<CategoryDto> {
    const newCategory = await this._categoryRepo.create(payload);
    if (!newCategory) {
      throw new AppError(Messages.CATEGORY_NOT_CREATED);
    }
    return CategorySchema.parse(newCategory);
  }

  /**
   *
   * @param id
   * @param payload
   * @returns
   */

  async updateCategory(id: string, payload: CategoryUpdateDtoType): Promise<CategoryDto> {
    let category = await this._categoryRepo.findById(id);
    if (!category) {
      throw new AppError(Messages.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    category.name = payload.name;
    await category.save();

    return CategorySchema.parse(category);
  }
  /**
   *
   * @param id
   */

  async blockCategory(id: string): Promise<void> {
    let category = await this._categoryRepo.findById(id);
    if (!category) {
      throw new AppError(Messages.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    category.isBlocked = true;
    await category.save();
  }

  /**
   *
   * @param id
   */

  async unblockCategory(id: string): Promise<void> {
    let category = await this._categoryRepo.findById(id);
    if (!category) {
      throw new AppError(Messages.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    category.isBlocked = false;
    await category.save();
  }
  /**
   *
   * @param filters
   * @returns
   */

  async listCategories(
    filters?: ListCategoryFilterType,
  ): Promise<{ category: CategoryDto[]; total: number }> {
    const {
      search,
      page = 1,
      limit = 10,
      isBlocked,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};

    const query: Record<string, any> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (typeof isBlocked === "boolean") {
      query.isBlocked = isBlocked;
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: (sortOrder === "asc" ? 1 : -1) as 1 | -1,
    };

    const [categories, total] = await Promise.all([
      this._categoryRepo.list({ query, limit, skip, sort }),
      this._categoryRepo.count(query),
    ]);

    // Inject id and validate with Zod
    const formatted = categories
      .map((c) => ({ id: String(c._id), ...c }))
      .filter((c) => typeof c.name === "string" && c.name.trim().length >= 3)
      .map((c) => CategorySchema.parse(c));

    return { category: formatted, total };
  }
}
