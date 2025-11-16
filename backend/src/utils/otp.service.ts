import crypto from "crypto";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/shared/inversify/types";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { AppError } from "../errors/app.error";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
export interface IOtpService {
  generateOtp(): string;
  storeOtp(key: string, data: object, ttlSeconds: number): Promise<void>;
  verifyOtp(key: string, otp: string): Promise<OtpData>;
}

export interface OtpData {
  name: string;
  email: string;
  password?: string;
  role: "learner" | "professional" | "admin";
  otp: string;
  newEmail?: string;
}

@injectable()
export class OtpService implements IOtpService {
  constructor(@inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository) {}
  generateOtp(length = 6): string {
    return Array.from(crypto.randomBytes(length))
      .map((byte) => (byte % 10).toString())
      .join("");
  }
  async storeOtp(key: string, data: OtpData, ttlSeconds: number): Promise<void> {
    await this._redisRepo.set<OtpData>(`${key}`, data, ttlSeconds);
  }
  async verifyOtp(key: string, otp: string): Promise<OtpData> {
    let match = await this._redisRepo.get<OtpData>(`${key}`);
    if (!match) {
      throw new AppError(Messages.OTP_EXPIRED, HttpStatus.BAD_REQUEST);
    }
    if (match?.otp !== otp) {
      throw new AppError(Messages.OTP_INVALID, HttpStatus.BAD_REQUEST);
    }
    await this._redisRepo.delete(key);
    return match;
  }
}
