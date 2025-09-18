import { BaseRepo } from "../Base/base";
import { IProfessional } from "../../models/profesionals";
import { Model, Document } from "mongoose";

export class ProfesionalRepo extends BaseRepo<IProfessional> {
  constructor(profesionalModel: Model<IProfessional & Document>) {
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
