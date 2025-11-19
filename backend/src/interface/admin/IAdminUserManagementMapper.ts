import { AdminLearnerArrayDTO } from "@/schema/admin/user/admin.learner.schema";
import { AdminProfessionalArrayDTO } from "@/schema/admin/user/admin.professional.schema";
import { LearnerData, ProfessionalData } from "@/services/admin/admin.userManagement.service";

/**
 * Maps learner and professional data between:
 *  - Raw Mongo documents (ILearnerProfile / IProfessionalProfile)
 *  - Internal DTOs (with keys like profile_key / resume_key)
 *  - Public DTOs (with computed URLs, no sensitive keys)
 */
export interface IAdminUserManagementMapper {
  toLearnerDtoArray: (learner: LearnerData[]) => AdminLearnerArrayDTO[];
  toProfessionalDtoArray: (professional: ProfessionalData[]) => AdminProfessionalArrayDTO[];
}
