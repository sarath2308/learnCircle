import { LearnerProfileDTOType } from "@/schema/learner/profile.response.dto";
import { UploadedFile } from "../shared/uploadFile.interface";
export interface ILearnerProfileService {
  /**
   *
   * @param userId
   */
  getProfile(userId: string): Promise<LearnerProfileDTOType | null>;
  /**
   *
   * @param userId
   * @param fileBuffer
   */
  updateProfilePhoto(userId: string, file: UploadedFile): Promise<string | null>;
  /**
   *
   * @param userId
   * @param newEmail
   */
  requestEmailChangeOtp(userId: string, newEmail: string): Promise<void>;
  /**
   *
   * @param userId
   */
  resendEmailChangeOtp(userId: string): Promise<void>;
  /**
   *
   * @param userId
   * @param otp
   */
  verifyEmailChangeOtp(userId: string, otp: string): Promise<LearnerProfileDTOType | null>;
  /**
   *
   * @param userId
   * @param name
   * @returns
   */
  updateName: (userId: string, name: string) => Promise<LearnerProfileDTOType | null>;
  /**
   *
   * @param userId
   * @param password
   * @param newPassword
   * @returns
   */
  updatePassword: (
    userId: string,
    newPassword: string,
    password: string,
  ) => Promise<LearnerProfileDTOType | null>;
  /**
   *
   * @param userId
   * @returns
   */

  getProfileUrl: (userId: string) => Promise<{ profileUrl: string } | null>;
}
