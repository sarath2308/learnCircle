import { BaseRepo } from "@/common";
import { IAdmin } from "../models/Admin";
import { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../common/types/inversify/types";

injectable();
export class AdminRepo extends BaseRepo<IAdmin> {
  constructor(@inject(TYPES.AdminModel) adminModel: Model<IAdmin>) {
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
