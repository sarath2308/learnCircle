import { inject, injectable } from "inversify";
import { AuthService } from "../auth.service";
import { TYPES } from "../../types/types";
import { EmailService } from "../emailService";
import { GenerateOtp } from "../../utils/otp.utils.";
import { IToken } from "../../utils/token.jwt";
import { IRedisRepository } from "../../Repositories/redisRepo";
import { IpasswordService } from "../passwordService";
import { ProfesionalRepo } from "../../Repositories/profesional/profesionalRepo";

@injectable()
export class ProfesionalAuthService extends AuthService {
  constructor(
    @inject(TYPES.ProfesionalRepo) private ProfesionalRepo: ProfesionalRepo,
    @inject(TYPES.EmailService) protected emailService: EmailService,
    @inject(TYPES.GenerateOtp) protected OtpService: GenerateOtp,
    @inject(TYPES.TokenService) protected accesToken: IToken,
    @inject(TYPES.RedisRepository) protected redis: IRedisRepository<any>,
    @inject(TYPES.PasswordService) protected passwordService: IpasswordService,
  ) {
    super(ProfesionalRepo, emailService, OtpService, accesToken, redis, passwordService);
  }
}
