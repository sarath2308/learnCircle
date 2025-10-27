import { inject, injectable } from "inversify";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalProfileRepo } from "../../profile/interface/IProfessionalProfileRepo";
import { ProfessionalDashboardResponseDTO } from "../dtos/dahsboard.dtos.schema";
import { IProfessionalDashboardDtoMap } from "../interfaces/IProfessionalDasboardDtoMap";
import { IProfessionalDashboardService } from "../interfaces/IProfessionalDashboard";
import { Types } from "mongoose";
import { IS3Service } from "@/common";

@injectable()
export class ProfessionalDashboardService implements IProfessionalDashboardService {
  constructor(
    @inject(TYPES.IProfessionalProfileRepo) private _profileRepo: IProfessionalProfileRepo,
    @inject(TYPES.IProfessionalDashboardDtoMap) private _dtoMaping: IProfessionalDashboardDtoMap,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
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
      if (profileData.profile_key) {
        let url = await this._s3Service.getFileUrl(profileData.profile_key);
        return this._dtoMaping.toDto(profileData, url);
      }
    }
    return this._dtoMaping.toDto(profileData);
  }
}
