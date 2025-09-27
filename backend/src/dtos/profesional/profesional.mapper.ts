// mappers/professional.mapper.ts
import type { ProfessionalResponseDTO } from "../../dtos/profesional/profesional.dto";
import { ProfesionalDto } from "../types/profesional.dto.type";

export function mapProfessionalToDTO(professional: ProfesionalDto): ProfessionalResponseDTO {
  return {
    id: professional._id.toString(),
    name: professional.name,
    email: professional.email,
    profileImg: professional.profileImg ?? "",
    joinedAt: professional.joinedAt!,
    isBlocked: professional.isBlocked,
    ProfileInfo: professional.ProfileInfo || {},
    RejectReason: professional.RejectReason,
    role: professional.role,
  };
}
