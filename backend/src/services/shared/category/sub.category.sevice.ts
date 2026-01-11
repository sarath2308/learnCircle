import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ISubCategoryRepo } from "@/interface/shared/category/subCat/sub.category.repo.interface";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { SubCategoryCreateDtoType } from "@/schema/shared/category/sub/sub.category.create";
import { ListSubCategoryFilterType } from "@/schema/shared/category/sub/sub.category.list";
import {
  SubCategoryDto,
  SubCategorySchema,
} from "@/schema/shared/category/sub/sub.category.response";
import {
  SubCategoryUserResponseSchema,
  SubCategoryUserResponseType,
} from "@/schema/shared/category/sub/sub.category.user.response";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";

type CategoryPopulated = {
  _id: Types.ObjectId;
  name: string;
};

@injectable()
export class SubCategoryService implements ISubCategoryService {
  constructor(@inject(TYPES.ISubCategoryRepo) private _subCategoryRepo: ISubCategoryRepo) {}

  async createCategory(payload: SubCategoryCreateDtoType): Promise<void> {
    const present = await this._subCategoryRepo.getSubCategoryByName(payload.name);

    if (present) throw new AppError(Messages.SUBCATEGORY_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    const categoryId = new mongoose.Types.ObjectId(payload.categoryId);
    const newSubCategory = await this._subCategoryRepo.create({ ...payload, categoryId });
    if (!newSubCategory) {
      throw new AppError(Messages.SUBCATEGORY_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCategory(id: string, payload: Partial<SubCategoryCreateDtoType>): Promise<void> {
    let categoryId: mongoose.Types.ObjectId;
    const subcategory = await this._subCategoryRepo.findById(id);
    if (!subcategory) {
      throw new AppError(Messages.SUBCATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    categoryId = new mongoose.Types.ObjectId(payload.categoryId);

    subcategory.name = payload.name || subcategory.name;
    subcategory.categoryId = categoryId || subcategory.categoryId;
    await subcategory.save();
  }
  async blockCategory(id: string): Promise<void> {
    let subcategory = await this._subCategoryRepo.findById(id);
    if (!subcategory) {
      throw new AppError(Messages.SUBCATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    subcategory.isBlocked = true;
    await subcategory.save();
  }

  async unblockCategory(id: string): Promise<void> {
    let subcategory = await this._subCategoryRepo.findById(id);
    if (!subcategory) {
      throw new AppError(Messages.SUBCATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    subcategory.isBlocked = false;
    await subcategory.save();
  }

  async listCategoryForAdmin(
    filters?: ListSubCategoryFilterType,
  ): Promise<{ category: SubCategoryDto[]; total: number }> {
    const {
      search,
      page = 1,
      limit = 10,
      isBlocked,
      categoryId,
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

    if (categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: (sortOrder === "asc" ? 1 : -1) as 1 | -1,
    };

    const [categories, total] = await Promise.all([
      this._subCategoryRepo.list({ query, limit, skip, sort }),
      this._subCategoryRepo.count(query),
    ]);

    // Inject id and validate with Zod
    const formatted = categories.map((c) => {
      let category = c.categoryId as unknown as CategoryPopulated;
      return SubCategorySchema.parse({
        id: String(c._id),
        category: {
          id: String(category._id),
          name: category.name ? category.name : "",
        },
        ...c,
      });
    });

    return { category: formatted, total };
  }

  async getSubCategoriesByCategoryId(
    categoryId: string,
  ): Promise<SubCategoryUserResponseType[] | []> {
    const subcategories = await this._subCategoryRepo.getSubCategoriesByCategoryId(categoryId);
    if (subcategories.length === 0) {
      return [];
    }

    const formatted = subcategories.map((c) => {
      const { categoryId, ...rest } = c;
      return SubCategoryUserResponseSchema.parse({
        id: String(c._id),
        categoryId: String(categoryId),
        ...rest,
      });
    });

    return formatted;
  }
}
