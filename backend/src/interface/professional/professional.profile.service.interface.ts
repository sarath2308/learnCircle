import { LearnerProfessionalProfileResponseType } from "@/schema/learner/professional-profile/learner.professional.profile.response.schema";
import { ProfessionalProfileDTOType } from "@/schema/professional/profile.request.schema";
import { UploadedFile } from "../shared/uploadFile.interface";

export interface IProfessionalProfileService {
  uploadData: (
    userId: string,
    data: ProfessionalProfileDTOType,
    files: {
      avatar: UploadedFile;
      resume: UploadedFile;
    },
  ) => Promise<void>;

  getAllProfilesForUser: (
    search: string,
    page: number,
  ) => Promise<LearnerProfessionalProfileResponseType[]>;

  getProfessionalProfileForUser: (instructorId: string) => Promise<any>;

  updateRating: (instructorId: string, rating: number) => Promise<void>;
}
