import { BaseRepo } from "../Base/base";
import { IProfessional } from "../../models/profesionals";
import { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/types";

injectable();
export class ProfesionalRepo extends BaseRepo<IProfessional> {
  constructor(@inject(TYPES.ProfesionalModel) profesionalModel: Model<IProfessional>) {
    super(profesionalModel);
  }

  async findByEmail(email: string): Promise<IProfessional | null> {
    try {
      const user = await this.model.findOne({ email }).lean<IProfessional>().exec();
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't find the user");
    }
  }
}
