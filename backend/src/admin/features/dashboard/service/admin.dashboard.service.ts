import { inject, injectable } from "inversify";
import { IAdminDashboardService } from "../interface/IAdminDashboardService";
import { TYPES } from "@/common/types/inversify/types";
import { IUserRepo } from "@/common/Repo";
import { AppError, HttpStatus, Messages } from "@/common";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(@inject(TYPES.IUserRepo) private _userRepo: IUserRepo) {}
  /**
   *
   * @param userId
   */
  async getDashboard(userId: string): Promise<void> {
    let user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
