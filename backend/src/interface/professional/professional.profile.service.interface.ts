import { LearnerProfessionalProfileResponseType } from "@/schema/learner/professional-profile/learner.professional.profile.response.schema";
import { ProfessionalProfileDTOType } from "@/schema/professional/profile.request.schema";
import { UploadFiles } from "@/services/professional/profesional.profile.service";

export interface IProfessionalProfileService {
  uploadData: (
    userId: string,
    data: ProfessionalProfileDTOType,
    files: UploadFiles,
  ) => Promise<void>;

  getAllProfilesForUser: (
    search: string,
    page: number,
  ) => Promise<LearnerProfessionalProfileResponseType[]>;
}
