import { LearnerDto } from "../types/learner.dto.type";
import { ProfesionalDto } from "../types/profesional.dto.type";
import { mapLearnerToDTO } from "../learner/learner.mapper";
import { mapProfessionalToDTO } from "../profesional/profesional.mapper";

export class RoleDtoMapper {
  async roleDtoMapper(doc: ProfesionalDto | LearnerDto) {
    switch (doc.role) {
      case "learner":
        return mapLearnerToDTO(doc as LearnerDto);
      case "profesional":
        return mapProfessionalToDTO(doc as ProfesionalDto);
      default:
        throw new Error("Unsupported role");
    }
  }
}
