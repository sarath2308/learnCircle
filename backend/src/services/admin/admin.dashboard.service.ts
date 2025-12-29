import { inject, injectable } from "inversify";
import { IAdminDashboardService } from "@/interface/admin/admin.dashboard.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { IUserRepo } from "@/repos/shared/user.repo";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";

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
