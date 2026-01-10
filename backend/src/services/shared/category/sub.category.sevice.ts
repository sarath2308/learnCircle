import { ISubCategoryRepo } from "@/interface/shared/category/subCaregory.repo.interface";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { SubCategoryCreateDtoType } from "@/schema/shared/category/sub/sub.category.create";
import { SubCategoryDto } from "@/schema/shared/category/sub/sub.category.response";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SubCategoryService implements ISubCategoryService {
  constructor(@inject(TYPES.ISubCategoryRepo) private _subCategoryRepo: ISubCategoryRepo) {}

  async createCategory(payload: SubCategoryCreateDtoType): Promise<SubCategoryDto> {
    const present = await this._subCategoryRepo.findByCategoryName(payload.name);
    if (present) throw new Error("Sub Category already exists");
    return await this._subCategoryRepo.create(payload);
  }

  async updateCategory(id: string, payload: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async blockCategory(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async unblockCategory(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async listCategoryForAdmin(filters?: any): Promise<{ category: any[]; total: number }> {
    throw new Error("Method not implemented.");
  }

  async getCategoryForUser(): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
}
