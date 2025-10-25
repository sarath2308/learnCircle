import { LearnerProfileDTOType } from "../dtos/schemas/profile.response.dto";
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
  updateProfilePhoto(
    userId: string,
    data: { originalName: string; mimeType: string; fileBuffer: Buffer },
  ): Promise<LearnerProfileDTOType | null>;
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
