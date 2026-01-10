import { ISubCategoryController } from "@/interface/shared/category/subCategory.controller.interface";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SubCategoryController implements ISubCategoryController {
  constructor(
    @inject(TYPES.ISubCategoryService) private _subCategoryService: ISubCategoryService,
  ) {}
}
