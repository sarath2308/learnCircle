import { inject, injectable } from "inversify";
import { AuthService } from "../auth.service";
import { TYPES } from "../../types/types";
import { EmailService } from "../emailService";
import { GenerateOtp } from "../../utils/otp.utils.";
import { IToken } from "../../utils/token.jwt";
import { IRedisRepository } from "../../Repositories/redisRepo";
import { IpasswordService } from "../passwordService";
import { LearnerRepo } from "../../Repositories/learner/learnerRepo";

@injectable()
export class LearnerAuthService extends AuthService {
  constructor(
    @inject(TYPES.LearnerRepo) private LearnerRepo: LearnerRepo,
    @inject(TYPES.EmailService) protected emailService: EmailService,
    @inject(TYPES.GenerateOtp) protected OtpService: GenerateOtp,
    @inject(TYPES.TokenService) protected accesToken: IToken,
    @inject(TYPES.RedisRepository) protected redis: IRedisRepository<any>,
    @inject(TYPES.PasswordService) protected passwordService: IpasswordService,
  ) {
    super(LearnerRepo, emailService, OtpService, accesToken, redis, passwordService);
  }
}
