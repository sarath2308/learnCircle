import { BaseRepo } from "../shared/base";
import { IAdmin } from "@/model/admin/Admin";
import { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/shared/inversify/types";

injectable();
export class AdminRepo extends BaseRepo<IAdmin> {
  constructor(@inject(TYPES.IAdminModel) adminModel: Model<IAdmin>) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      const user = await this.model.findOne({ email }).exec();
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't find the user");
    }
  }
}
