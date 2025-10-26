import { ProfessionalDashboardResponseDTO } from "../dtos/dahsboard.dtos.schema";

export interface IProfessionalDashboardService {
  getDashboard: (userId: string) => Promise<ProfessionalDashboardResponseDTO | void>;
}
