import { LearnerRepo } from "../../../Repositories/learner/learnerRepo";
import { TYPES } from "../../../common/types/types";
import { inject, injectable } from "inversify";
import { GenerateOtp } from "../../../utils/otp.utils.";
import { EmailService } from "../../../utils/emailService";
import { IRedisRepository } from "../../../common/Repo/redisRepo";
import { IpasswordService } from "../../../utils/passwordService";
import { CloudinaryService } from "../../../utils/cloudinary.service";
import { v4 as uuid } from "uuid";
import { LearnerDto, PartialLearnerProfile } from "../../../dtos/types/learner.dto.type";
import { LearnerProfileDTOType, mapProfileToDTO } from "../dtos/profile.dto";
import { RedisKeys } from "../../../common/constants/redisKeys";

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

  async getProfile(userId: string): Promise<LearnerProfileDTOType> {
    const user = await this.LearnerRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const imageUrl = user.publicId
      ? await this.cloudinary.generateSignedUrl(user.publicId)
      : process.env.DEFAULT_PROFILE_IMAGE;

    const userWithImg: LearnerDto = {
      ...user.toObject(),
      profileImg: imageUrl,
    };

    return mapProfileToDTO(userWithImg);
  }

  async uploadProfilePhoto(userId: string, fileBuffer: Buffer) {
    const publicId = `user_${userId}_${uuid()}`;

    await this.cloudinary.uploadImage(fileBuffer, publicId);

    await this.LearnerRepo.updateProfilePhoto(userId, publicId);

    const imageUrl = await this.cloudinary.generateSignedUrl(publicId);

    return imageUrl;
  }
  async updateProfile(userId: string, name: string): Promise<PartialLearnerProfile> {
    let user = await this.LearnerRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let updated = await this.LearnerRepo.update(userId, { name: name });
    if (!updated) {
      throw new Error("profile not updated");
    }
    return mapProfileToDTO(updated);
  }
  async requestOtp(userId: string, type: string = "email") {
    const user = await this.LearnerRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const otp = await this.OtpService.getOtp();

    await this.emailService.sendChangeEmailOtp(user.email, otp);

    await this.redis.set(`${RedisKeys.EMAIL}:${userId}`, otp, "EX", 60);

    return { success: true, message: "OTP sent" };
  }

  async verifyOtp(userId: string, otp: string) {
    const user = await this.LearnerRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const storedOtp = await this.redis.get(`${RedisKeys.EMAIL}:${userId}`);
    if (!storedOtp) throw new Error("OTP expired or not found");

    if (storedOtp !== otp) throw new Error("Incorrect OTP");

    await this.redis.delete(`${RedisKeys.EMAIL}:${userId}`);

    return { success: true, message: "OTP verified" };
  }
}
