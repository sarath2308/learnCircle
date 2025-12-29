import { injectable, inject } from "inversify";
import { BaseRepo, IBaseRepo } from "./base";
import { IUser } from "@/model/shared/user.model";
import { TYPES } from "../../types/shared/inversify/types";
import { Model } from "mongoose";

export interface IUserRepo extends IBaseRepo<IUser> {
  findWithEmailAndRole: (email: string, role: string) => Promise<IUser | null>;
  updatePassword: (id: string, password: string) => Promise<IUser | null>;
  findByEmail: (email: string) => Promise<IUser | null>;
}

@injectable()
export class UserRepo extends BaseRepo<IUser> implements IUserRepo {
  constructor(@inject(TYPES.IUserModel) private _model: Model<IUser>) {
    super(_model);
  }
  async findWithEmailAndRole(email: string, role: string): Promise<IUser | null> {
    return await this._model.findOne({ email: email, role: role });
  }
  async updatePassword(id: string, password: string): Promise<IUser | null> {
    return await this._model.findByIdAndUpdate(
      { _id: id },
      { passwordHash: password },
      { new: true },
    );
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await this._model.findOne({ email: email, isBlocked: false });
  }
}
