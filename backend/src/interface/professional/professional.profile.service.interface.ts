import { LearnerProfessionalProfileResponseType } from "@/schema/learner/professional-profile/learner.professional.profile.response.schema";
import { ProfessionalProfileDTOType } from "@/schema/professional/profile.request.schema";
import { UploadedFile } from "../shared/uploadFile.interface";
import { ProfessionalProfileUpdateType } from "@/schema/professional/professional-profile/professiona.profile.update.schema";

export interface IProfessionalProfileService {
  uploadData: (
    userId: string,
    data: ProfessionalProfileDTOType,
    files: {
      avatar: UploadedFile;
      resume: UploadedFile;
    },
  ) => Promise<void>;

  updateProfile: (instructorId: string, data: ProfessionalProfileUpdateType) => Promise<void>;

  getAllProfilesForUser: (
    search: string,
    page: number,
  ) => Promise<LearnerProfessionalProfileResponseType[]>;

  getProfessionalProfileForUser: (instructorId: string) => Promise<any>;

  updateRating: (instructorId: string, rating: number) => Promise<void>;

  updateSessions: (instructorId: string) => Promise<void>;

  updatePassword: (instructorId: string, oldPassword: string, newPassword: string) => Promise<void>;

  updateProfilePicture: (instructorId: string, file: UploadedFile) => Promise<void>;

  logout: (instructorId: string, jti: string) => Promise<void>;

  requestChangeEmail: (instructorId: string, newEmail: string) => Promise<void>;

  verifyAndUpdateEmail: (instructorId: string, otp: string) => Promise<void>;
}
