import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { ISubCategoryController } from "@/interface/shared/category/subCat/sub.category.controller.interface";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class SubCategoryController implements ISubCategoryController {
  constructor(
    @inject(TYPES.ISubCategoryService) private _subCategoryService: ISubCategoryService,
  ) {}

  async createSubCategory(req: IAuthRequest, res: Response): Promise<void> {
    let result = await this._subCategoryService.createCategory(req.body);
    res.status(HttpStatus.CREATED).json({ success: true, newData: result });
  }

  async updateSubCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    let result = await this._subCategoryService.updateCategory(id, req.body);
    res.status(HttpStatus.CREATED).json({ success: true, updatedData: result });
  }

  async blockSubCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    await this._subCategoryService.blockCategory(id);
    res.status(HttpStatus.CREATED).json({ success: true });
  }

  async unblockSubCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    await this._subCategoryService.unblockCategory(id);
    res.status(HttpStatus.CREATED).json({ success: true });
  }

  async listSubCategoryForAdmin(req: IAuthRequest, res: Response): Promise<void> {
    const { page, limit, search, isBlocked, sortBy, sortOrder, categoryId } = req.query;

    const filters = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      isBlocked: isBlocked === "true" ? true : isBlocked === "false" ? false : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      sortOrder: sortOrder as "asc" | "desc" | undefined,
    };
    let result = await this._subCategoryService.listCategoryForAdmin(filters);
    res
      .status(HttpStatus.OK)
      .json({ success: true, subCategoryData: result.category, total: result.total });
  }

  async getSubCategoryByCategoryId(req: IAuthRequest, res: Response): Promise<void> {
    const { categoryId } = req.params;
    const result = await this._subCategoryService.getSubCategoriesByCategoryId(categoryId);
    res.status(HttpStatus.OK).json({ success: true, subCategories: result });
  }
}
