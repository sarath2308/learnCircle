import { BaseRepo, IBaseRepo, IRepoRole, Role } from "@/common";
import { IProfessional } from "../models/profesionals";
import { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../common/types/inversify/types";
export interface IProfessionalRepo extends IBaseRepo<IProfessional>, IRepoRole {}
injectable();
export class ProfesionalRepo extends BaseRepo<IProfessional> implements IProfessionalRepo {
  readonly role: string = Role.Professional;
  constructor(@inject(TYPES.ProfesionalModel) profesionalModel: Model<IProfessional>) {
    super(profesionalModel);
  }
}
