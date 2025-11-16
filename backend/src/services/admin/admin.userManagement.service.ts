import { inject, injectable } from "inversify";
import { IAdminUserManagementService } from "@/interface/admin/IAdminUserManagementService";
import { TYPES } from "@/types/shared/inversify/types";
import { ILearnerProfileRepo } from "@/interface/learner/ILearnerProfileRepo";
import { IProfessionalProfileRepo } from "@/interface/professional/IProfessionalProfileRepo";
import {
  AdminLearnerArraySchema,
  AdminLearnerArrayDTO,
} from "../../schema/admin/admin.learner.schema";
import {
  AdminProfessionalArraySchema,
  AdminProfessionalArrayDTO,
} from "../../schema/admin/admin.professional.schema";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { IS3Service } from "@/interface/shared/IS3Service";
import { IUserRepo } from "@/repos/shared/user.repo";
import { IEmailService } from "@/utils";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { RedisKeys } from "@/constants/shared/redisKeys";

export type LearnerData = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  profile_key?: string | null;
  role: string;
};

export type ProfessionalData = {
  _id: string;
  userId: string;
  email: string;
  name: string;
  status?: string | null;
  rating?: number | null;
  totalSessions?: number | null;
  profile_key?: string | null;
  resume_key?: string | null;
  role: string;
  isBlocked: boolean;
};

@injectable()
export class AdminUserManagementService implements IAdminUserManagementService {
  constructor(
    @inject(TYPES.ILearnerProfileRepo)
    private _learnerRepo: ILearnerProfileRepo,

    @inject(TYPES.IProfessionalProfileRepo)
    private _professionalRepo: IProfessionalProfileRepo,

    @inject(TYPES.IS3Service)
    private _s3Service: IS3Service,

    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,

    @inject(TYPES.IEmailService) private _emailService: IEmailService,

    @inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository,
  ) {}

  async getLearnerData(
    page: number,
    search: string,
  ): Promise<{
    data: AdminLearnerArrayDTO;
    totalCount: number;
  }> {
    const learners = await this._learnerRepo.getAllProfile(page, search);
    const totalCount = await this._learnerRepo.countAll(search);
    const learnerData = await Promise.all(
      learners.map(async (learner: LearnerData) => {
        const profileUrl = learner.profile_key
          ? await this._s3Service.getFileUrl(learner.profile_key)
          : null;

        return {
          id: learner._id.toString(),
          userId: learner.userId.toString(),
          name: learner.name,
          email: learner.email,
          status: learner.isBlocked ? "blocked" : "active",
          isBlocked: learner.isBlocked,
          role: learner.role,
          profileUrl,
        };
      }),
    );

    return {
      data: AdminLearnerArraySchema.parse(learnerData),
      totalCount,
    };
  }
  /**
   *
   * @param userId
   */
  async getProfessionalData(
    page: number,
    search: string,
  ): Promise<{
    data: AdminProfessionalArrayDTO;
    totalCount: number;
  }> {
    const professionals = await this._professionalRepo.getAllProfile(page, search);
    const totalCount = await this._professionalRepo.countAll(search);

    const professionalData = await Promise.all(
      professionals.map(async (pro: ProfessionalData) => {
        const profileUrl = pro.profile_key
          ? await this._s3Service.getFileUrl(pro.profile_key)
          : null;
        const resumeUrl = pro.resume_key ? await this._s3Service.getFileUrl(pro.resume_key) : null;

        return {
          id: pro._id.toString(),
          userId: pro.userId.toString(),
          email: pro.email,
          name: pro.name,
          status: pro.status ?? null,
          role: pro.role,
          rating: pro.rating ?? null,
          totalSessions: pro.totalSessions ?? null,
          state: pro.isBlocked ? "Blocked" : "active",
          isBlocked: pro.isBlocked,
          profileUrl,
          resumeUrl,
        };
      }),
    );

    return {
      data: AdminProfessionalArraySchema.parse(professionalData),
      totalCount,
    };
  }
  async blockUser(userId: string): Promise<void> {
    let userData = await this._userRepo.findById(userId);

    if (!userData) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    userData.isBlocked = true;
    await this._redisRepo.delete(`${RedisKeys.REFRESH}:${userId}`);
    await userData.save();
  }
  /**
   *
   * @param userId
   */

  async unblockUser(userId: string): Promise<void> {
    let userData = await this._userRepo.findById(userId);

    if (!userData) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    userData.isBlocked = false;
    await userData.save();
  }
  /**
   *
   * @param userId
   */
  async approveUser(userId: string): Promise<void> {
    let profileData = await this._professionalRepo.getProfile(userId);

    let userData = await this._userRepo.findById(userId);

    if (!profileData || !userData) {
      throw new AppError(Messages.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    profileData.status = "approved";
    await profileData.save();
    await this._emailService.sendProfileApprovedMail(userData.email, userData.name);
  }

  /**
   *
   * @param userId
   * @param reason
   */
  async rejectUser(userId: string, reason: string): Promise<void> {
    let profileData = await this._professionalRepo.getProfile(userId);

    let userData = await this._userRepo.findById(userId);

    if (!profileData || !userData) {
      throw new AppError(Messages.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    profileData.status = "rejected";
    await profileData.save();
    await this._emailService.sendProfileRejectedMail(userData.email, userData.name, reason);
  }
}
