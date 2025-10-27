import { IProfessionalProfile } from "../../profile/models/profesional.profile";
import { ProfessionalDashboardResponseDTO } from "../dtos/dahsboard.dtos.schema";

export interface IProfessionalDashboardDtoMap {
  toDto: (profile: IProfessionalProfile, profileUrl?: string) => ProfessionalDashboardResponseDTO;
}
