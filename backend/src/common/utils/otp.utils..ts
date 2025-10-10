import crypto from "crypto";
import { injectable } from "inversify";
export interface IOtpService {
  generateOtp(): string;
  storeOtp(key: string, data: object, ttlSeconds: number): Promise<void>;
  verifyOtp(key: string, otp: string): Promise<object>;
  sendOtp(key: string, email: string, type: "signup" | "forgot"): Promise<void>;
}
@injectable()
export class OtpService implements IOtpService {
  constructor() {}
  generateOtp(length = 6): string {
    return Array.from(crypto.randomBytes(length))
      .map((byte) => (byte % 10).toString())
      .join("");
  }
  storeOtp(key: string, data: object, ttlSeconds: number): Promise<void> {}
  verifyOtp(key: string, otp: string): Promise<object> {}
  sendOtp(key: string, email: string, type: "signup" | "forgot"): Promise<void> {}
}
