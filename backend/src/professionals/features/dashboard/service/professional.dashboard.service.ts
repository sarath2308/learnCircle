import { inject, injectable } from "inversify";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalProfileRepo } from "../../profile/interface/IProfessionalProfileRepo";
import { ProfessionalDashboardResponseDTO } from "../dtos/dahsboard.dtos.schema";
import { IProfessionalDashboardDtoMap } from "../interfaces/IProfessionalDasboardDtoMap";
import { IProfessionalDashboardService } from "../interfaces/IProfessionalDashboard";
import { Types } from "mongoose";

@injectable()
export class ProfessionalDashboardService implements IProfessionalDashboardService {
  constructor(
    @inject(TYPES.IProfesionalProfileRepo) private _profileRepo: IProfessionalProfileRepo,
    @inject(TYPES.IProfessionalDashboardDtoMap) private _dtoMaping: IProfessionalDashboardDtoMap,
  ) {}
  /**
   *
   * @param userId
   * @returns
   */
  async getDashboard(userId: string): Promise<ProfessionalDashboardResponseDTO | void> {
    let profileData = await this._profileRepo.getProfile(userId);
    if (!profileData) {
      profileData = await this._profileRepo.create({
        userId: new Types.ObjectId(userId),
      });
    }
    return this._dtoMaping.toDto(profileData);
  }
}
