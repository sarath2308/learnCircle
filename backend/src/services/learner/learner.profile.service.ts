import { LearnerRepo } from "../../Repositories/learner/learnerRepo";
import { TYPES } from "../../types/types";
import { inject, injectable } from "inversify";
import { GenerateOtp } from "../../utils/otp.utils.";
import { EmailService } from "../../utils/emailService";
import { IRedisRepository } from "../../Repositories/redisRepo";
import { IpasswordService } from "../../utils/passwordService";
import { mapLearnerToDTO } from "../../dtos/learner/learner.mapper";
import type { LearnerResponseDTOType } from "../../dtos/learner/learner.dto";
import { CloudinaryService } from "../../utils/cloudinary.service";
import { v4 as uuid } from "uuid";
import { LearnerDto } from "../../dtos/types/learner.dto.type";

@injectable()
export class LearnerProfileService {
  constructor(
    @inject(TYPES.LearnerRepo) private LearnerRepo: LearnerRepo,
    @inject(TYPES.EmailService) protected emailService: EmailService,
    @inject(TYPES.GenerateOtp) protected OtpService: GenerateOtp,
    @inject(TYPES.RedisRepository) protected redis: IRedisRepository<any>,
    @inject(TYPES.PasswordService) protected passwordService: IpasswordService,
    @inject(TYPES.CloudinaryService) private cloudinary: CloudinaryService,
  ) {}

  async getProfile(userId: string): Promise<LearnerResponseDTOType> {
    const user = await this.LearnerRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const imageUrl = user.publicId
      ? await this.cloudinary.generateSignedUrl(user.publicId)
      : process.env.DEFAULT_PROFILE_IMAGE;

    const userWithImg: LearnerDto = {
      ...user.toObject(),
      profileImg: imageUrl,
    };

    return mapLearnerToDTO(userWithImg);
  }

  async uploadProfilePhoto(userId: string, fileBuffer: Buffer) {
    const publicId = `user_${userId}_${uuid()}`;

    await this.cloudinary.uploadImage(fileBuffer, publicId);

    await this.LearnerRepo.updateProfilePhoto(userId, publicId);

    const imageUrl = await this.cloudinary.generateSignedUrl(publicId);

    return imageUrl;
  }
}
