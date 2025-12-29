import { ProfessionalDashboardResponseDTO } from "@/schema/professional/dahsboard.dtos.schema";

export interface IProfessionalDashboardService {
  getDashboard: (userId: string) => Promise<ProfessionalDashboardResponseDTO | void>;
}
