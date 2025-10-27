import { inject, injectable } from "inversify";
import { IAdminUserManagementService } from "../interfaces/IAdminUserManagementService";
import { TYPES } from "@/common/types/inversify/types";
import { ILearnerProfileRepo } from "@/learner/features/profile/interface/ILearnerProfileRepo";
import { IProfessionalProfileRepo } from "@/professionals/features/profile/interface/IProfessionalProfileRepo";
import { AppError, HttpStatus, IEmailService, IS3Service, Messages, RedisKeys } from "@/common";
import { AdminLearnerArraySchema, AdminLearnerArrayDTO } from "../dtos/schema/admin.learner.schema";
import {
  AdminProfessionalArraySchema,
  AdminProfessionalArrayDTO,
} from "../dtos/schema/admin.professional.schema";
import { IRedisRepository, IUserRepo } from "@/common/Repo";

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

  async getUserData(): Promise<{
    learners: AdminLearnerArrayDTO;
    professionals: AdminProfessionalArrayDTO;
  }> {
    const [learners, professionals] = await Promise.all([
      this._learnerRepo.getAllProfile(),
      this._professionalRepo.getAllProfile(),
    ]);

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
      learners: AdminLearnerArraySchema.parse(learnerData),
      professionals: AdminProfessionalArraySchema.parse(professionalData),
    };
  }
  /**
   *
   * @param userId
   */

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
