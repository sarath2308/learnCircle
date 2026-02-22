import { IProfessionalProfile } from "@/model/professional/professional.profile";
import { ProfessionalDashboardResponseDTO } from "@/schema/professional/dahsboard.dtos.schema";

export interface IProfessionalDashboardDtoMap {
  toDto: (profile: IProfessionalProfile, profileUrl?: string) => ProfessionalDashboardResponseDTO;
}
