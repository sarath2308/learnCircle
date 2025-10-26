import { ProfessionalProfileDTOType } from "../dtos/profile.request.schema";
import { UploadFiles } from "../services/profesional.profile.service";

export interface IProfessionalProfileService {
  uploadData: (
    userId: string,
    data: ProfessionalProfileDTOType,
    files: UploadFiles,
  ) => Promise<void>;
}
