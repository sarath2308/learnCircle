import { inject, injectable } from "inversify";
import { IProfesionalProfileRepo } from "../interface/IProfessionalProfileRepo";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalProfile } from "../models/profesional.profile";
import { Model } from "mongoose";
import { BaseRepo } from "@/common/baseRepo";
@injectable()
export class ProfessionalProfileRepo
  extends BaseRepo<IProfessionalProfile>
  implements IProfesionalProfileRepo
{
  constructor(
    @inject(TYPES.IProfessionalProfileModel) private _model: Model<IProfessionalProfile>,
  ) {
    super(_model);
  }
  async getProfile(id: string): Promise<IProfessionalProfile | null> {
    return await this._model.findOne({ userId: id }).populate("userId").lean();
  }
}
