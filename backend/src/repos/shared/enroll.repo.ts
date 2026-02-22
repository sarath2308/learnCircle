import { IEnroll } from "@/model/shared/enroll";
import { BaseRepo } from "./base";
import { IEnrollRepo } from "@/interface/shared/enroll/enroll.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class EnrollRepo extends BaseRepo<IEnroll> implements IEnrollRepo {
  constructor(@inject(TYPES.IEnroll) private _enrollModel: Model<IEnroll>) {
    super(_enrollModel);
  }
}
