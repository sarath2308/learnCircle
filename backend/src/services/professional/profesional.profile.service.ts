import { injectable, inject } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { IProfessionalProfileRepo } from "@/interface/professional/professional.profile.repo.interface";
import { Types } from "mongoose";
import { IUserRepo } from "@/repos/shared/user.repo";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { ProfessionalProfileDTOType } from "@/schema/professional/profile.request.schema";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import {
  LearnerProfessionalProfileCardResponseSchema,
  LearnerProfessionalProfileResponseType,
} from "@/schema/learner/professional-profile/learner.professional.profile.response.schema";
import { LearnerProfessionalProfileResponseSchema } from "@/schema/learner/professional-profile/learner.professional.profile.response";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";

@injectable()
export class ProfessionalProfileService implements IProfessionalProfileService {
  constructor(
    @inject(TYPES.IProfessionalProfileRepo) private _profileRepo: IProfessionalProfileRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
  ) {}
  /**
   *
   * @param userId
   * @param data
   * @param files
   */
  async uploadData(
    userId: string,
    data: ProfessionalProfileDTOType,
    files: { avatar: UploadedFile; resume: UploadedFile },
  ): Promise<void> {
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

    const profile_key = await this._s3Service.generateS3Key(userId, files.avatar.originalName);
    await this._s3Service.uploadFileFromStream(
      files.avatar.path,
      profile_key,
      files.avatar.mimeType,
      3600,
    );
    profileData.profile_key = profile_key;
    await profileData.save();

    const resume_key = await this._s3Service.generateS3Key(userId, files.resume.originalName);
    await this._s3Service.uploadFileFromStream(
      files.resume.path,
      resume_key,
      files.resume.mimeType,
      3600,
    );
    profileData.resume_key = resume_key;
    await profileData.save();
  }

  async getAllProfilesForUser(
    search: string,
    page: number,
  ): Promise<LearnerProfessionalProfileResponseType[]> {
    const profileData = await this._profileRepo.getAllProfileForUser(page, search);

    const responseObj = Promise.all(
      profileData.map(async (profile) => {
        let profileUrl = null;
        if (profile.profile_key) {
          profileUrl = await this._s3Service.getFileUrl(profile.profile_key);
        }
        return LearnerProfessionalProfileCardResponseSchema.parse({
          name: profile.name,
          rating: profile.rating,
          instructorId: String(profile.userId),
          profileUrl: profileUrl ?? "",
          title: profile.title ?? "",
        });
      }),
    );
    return responseObj;
  }

  async getProfessionalProfileForUser(
    instructorId: string,
  ): Promise<LearnerProfessionalProfileResponseType> {
    const profileData = await this._profileRepo.getProfileOfInstructor(instructorId);
    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    console.log("Profile Data:", profileData); // Debug log to check the retrieved profile data
    let profileUrl = null;
    if (profileData.profile_key) {
      profileUrl = await this._s3Service.getFileUrl(profileData.profile_key);
    }

    const reponseObj = {
      userId: String(profileData.userId),
      email: profileData.email,
      name: profileData.name ?? "",
      bio: profileData.bio,
      companyName: profileData.companyName,
      experience: profileData.experience,
      profileUrl: profileUrl ?? "",
      rating: profileData.rating ?? 0,
      sessionPrice: profileData.sessionPrice ?? 0,
      skills: profileData.skills,
      title: profileData.title,
      totalSessions: profileData.totalSessions ?? 0,
      typesOfSessions: profileData.typesOfSessions,
      instructorId: String(profileData.userId),
    };

    return LearnerProfessionalProfileResponseSchema.parse(reponseObj);
  }
}
