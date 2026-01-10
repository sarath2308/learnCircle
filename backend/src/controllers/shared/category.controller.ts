import { HttpStatus } from "@/constants/shared/httpStatus";
import { ICategoryController } from "@/interface/admin/category.controller.interface";
import { ICategoryService } from "@/interface/shared/category/category.service.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryController implements ICategoryController {
  constructor(@inject(TYPES.ICategoryService) private _categoryService: ICategoryService) {}

  async listCategoryForAdmin(req: IAuthRequest, res: Response): Promise<void> {
    const { page, limit, search, isBlocked, sortBy, sortOrder } = req.query;

    const filters = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      isBlocked: isBlocked === "true" ? true : isBlocked === "false" ? false : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder as "asc" | "desc" | undefined,
    };
    let result = await this._categoryService.listCategoryForAdmin(filters);
    res
      .status(HttpStatus.OK)
      .json({ success: true, categoryData: result.category, total: result.total });
  }

  async createCategory(req: IAuthRequest, res: Response): Promise<void> {
    let result = await this._categoryService.createCategory(req.body);
    res.status(HttpStatus.CREATED).json({ success: true, newData: result });
  }

  async updateCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    let result = await this._categoryService.updateCategory(id, req.body);
    res.status(HttpStatus.CREATED).json({ success: true, updatedData: result });
  }

  async unblockCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    await this._categoryService.unblockCategory(id);
    res.status(HttpStatus.CREATED).json({ success: true });
  }

  async blockCategory(req: IAuthRequest, res: Response): Promise<void> {
    let { id } = req.params;
    await this._categoryService.blockCategory(id);
    res.status(HttpStatus.CREATED).json({ success: true });
  }

  async getCategoryForUser(req: IAuthRequest, res: Response): Promise<void> {
    const data = await this._categoryService.getCategoryForUser();
    res.status(HttpStatus.OK).json({ success: true, categoryData: data });
  }
}
