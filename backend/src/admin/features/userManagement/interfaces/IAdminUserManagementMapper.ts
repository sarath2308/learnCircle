import { LearnerData, ProfessionalData } from "../service/admin.userManagement.service";
import { AdminLearnerArrayDTO } from "../dtos/schema/admin.learner.schema";
import { AdminProfessionalArrayDTO } from "../dtos/schema/admin.professional.schema";

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
