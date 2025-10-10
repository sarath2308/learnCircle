import { inject, injectable } from "inversify";
import { AuthService } from "@/common";
import { TYPES } from "@/common";
import { EmailService } from "@/common";
import { GenerateOtp } from "@/common";
import { IToken } from "@/common";
import { IRedisRepository } from "@/common";
import { IpasswordService } from "@/common";
import { ProfesionalRepo } from "@/professionals";
import { CloudinaryService } from "@/common";
import { RoleDtoMapper } from "@/dtos/mapper/dtos.mapper";
@injectable()
export class ProfesionalAuthService extends AuthService {
  constructor(
    @inject(TYPES.ProfesionalRepo) private ProfesionalRepo: ProfesionalRepo,
    @inject(TYPES.EmailService) protected emailService: EmailService,
    @inject(TYPES.GenerateOtp) protected OtpService: GenerateOtp,
    @inject(TYPES.TokenService) protected accesToken: IToken,
    @inject(TYPES.RedisRepository) protected redis: IRedisRepository<any>,
    @inject(TYPES.PasswordService) protected passwordService: IpasswordService,
    @inject(TYPES.CloudinaryService) protected cloudinary: CloudinaryService,
    @inject(TYPES.RoleDtoMapper) protected roleMapper: RoleDtoMapper,
  ) {
    super(
      ProfesionalRepo,
      emailService,
      OtpService,
      accesToken,
      redis,
      passwordService,
      cloudinary,
      roleMapper,
    );
  }
}
