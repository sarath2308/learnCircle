import { injectable, inject } from "inversify";
import { BaseRepo, IBaseRepo } from "../baseRepo";
import { IUser, TYPES } from "@/common";
import { Model } from "mongoose";
export interface IUserRepo extends IBaseRepo<IUser> {}
@injectable()
export class UserRepo extends BaseRepo<IUser> implements IUserRepo {
  constructor(@inject(TYPES.UserModel) private _model: Model<IUser>) {
    super(_model);
  }
}
