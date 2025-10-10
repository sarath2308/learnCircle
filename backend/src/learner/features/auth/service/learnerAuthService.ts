import { inject, injectable } from "inversify";
import { AuthService, IAuthService } from "@/common";
import { TYPES } from "@/common";
import { EmailService } from "@/common";
import { GenerateOtp } from "@/common";
import { IToken } from "@/common";
import { IRedisRepository } from "@/common";
import { IpasswordService } from "@/common";
import { LearnerRepo } from "@/learner";
import { CloudinaryService } from "@/common";
import { RoleDtoMapper } from "@/dtos/mapper/dtos.mapper";

@injectable()
export class LearnerAuthService implements IAuthService {
  constructor() {}
}
