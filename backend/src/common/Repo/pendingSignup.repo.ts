import { injectable, inject } from "inversify";
import { BaseRepo, IBaseRepo } from "../baseRepo";
import { TYPES } from "@/common";
import { Model } from "mongoose";
import { IPendingSignup } from "../models/pendingUser.model";
export interface IPendingSignupRepo extends IBaseRepo<IPendingSignup> {}
@injectable()
export class PendingSignupRepo extends BaseRepo<IPendingSignup> implements IPendingSignupRepo {
  constructor(@inject(TYPES.IPendingSignup) private _model: Model<IPendingSignup>) {
    super(_model);
  }
}
