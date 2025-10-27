import { AdminLearnerArrayDTO } from "../dtos/schema/admin.learner.schema";
import { AdminProfessionalArrayDTO } from "../dtos/schema/admin.professional.schema";

export interface IAdminUserManagementService {
  getUserData: () => Promise<{
    learners: AdminLearnerArrayDTO;
    professionals: AdminProfessionalArrayDTO;
  }>;

  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string, reason: string) => Promise<void>;
}
