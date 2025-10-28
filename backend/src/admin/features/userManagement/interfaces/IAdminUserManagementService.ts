import { AdminLearnerArrayDTO } from "../dtos/schema/admin.learner.schema";
import { AdminProfessionalArrayDTO } from "../dtos/schema/admin.professional.schema";

export interface IAdminUserManagementService {
  getLearnerData: (
    page: number,
    search: string,
  ) => Promise<{
    data: AdminLearnerArrayDTO;
    totalCount: number;
  }>;
  getProfessionalData: (
    page: number,
    search: string,
  ) => Promise<{
    data: AdminProfessionalArrayDTO;
    totalCount: number;
  }>;

  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string, reason: string) => Promise<void>;
}
