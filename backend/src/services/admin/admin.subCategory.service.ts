import { ISubCategoryRepo } from "@/interface/admin/subCaregory.repo.interface";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SubCategoryService implements ISubCategoryService {
  constructor(@inject(TYPES.ISubCategoryRepo) private _subcategoryRepo: ISubCategoryRepo) {}
}
