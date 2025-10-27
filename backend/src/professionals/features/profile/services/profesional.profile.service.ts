import { injectable, inject } from "inversify";
import { TYPES } from "../../../../common/types/inversify/types";
import { IProfessionalProfileRepo } from "@/professionals/features/profile/interface/IProfessionalProfileRepo";
import { AppError, HttpStatus, IS3Service, Messages } from "@/common";
import { Types } from "mongoose";
import { IUserRepo } from "@/common/Repo";
import { IProfessionalProfileService } from "../interface/IProfessionalProfileService";
import { ProfessionalProfileDTOType } from "../dtos/profile.request.schema";

export interface UploadFiles {
  avatar?: {
    buffer?: Buffer;
    mimeType?: string;
    originalName?: string;
  };
  resume?: {
    buffer?: Buffer;
    mimeType?: string;
    originalName?: string;
  };
}

@injectable()
export class ProfessionalProfileService implements IProfessionalProfileService {
  constructor(
    @inject(TYPES.IProfesionalProfileRepo) private _profileRepo: IProfessionalProfileRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
  ) {}
  /**
   *
   * @param userId
   * @param data
   * @param files
   */
  async uploadData(userId: string, data: ProfessionalProfileDTOType, files: UploadFiles) {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let profileData = await this._profileRepo.getProfile(userId);

    if (!profileData) {
      profileData = await this._profileRepo.create({
        userId: new Types.ObjectId(userId),
        title: data.title,
        bio: data.bio,
        companyName: data.companyName,
        experience: data.experience,
        skills: data.skills,
        typesOfSessions: data.typesOfSessions,
        status: "processing",
      });
    } else {
      // Update existing profile fields
      profileData.title = data.title;
      profileData.bio = data.bio;
      profileData.companyName = data.companyName;
      profileData.experience = data.experience;
      profileData.skills = data.skills;
      profileData.typesOfSessions = data.typesOfSessions;
      profileData.status = "processing";

      await profileData.save(); // Save updated fields
    }

    if (files.avatar?.buffer && files.avatar.mimeType && files.avatar.originalName) {
      const profile_key = await this._s3Service.generateS3Key(userId, files.avatar.originalName);
      await this._s3Service.uploadFileFromBuffer(
        files.avatar.buffer,
        profile_key,
        files.avatar.mimeType,
      );
      profileData.profile_key = profile_key;
      await profileData.save();
    }

    if (files.resume?.buffer && files.resume.mimeType && files.resume.originalName) {
      const resume_key = await this._s3Service.generateS3Key(userId, files.resume.originalName);
      await this._s3Service.uploadFileFromBuffer(
        files.resume.buffer,
        resume_key,
        files.resume.mimeType,
      );
      profileData.resume_key = resume_key;
      await profileData.save();
    }
  }
}
