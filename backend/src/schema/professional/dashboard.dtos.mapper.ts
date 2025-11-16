import { IProfessionalDashboardDtoMap } from "../interfaces/IProfessionalDasboardDtoMap";
import { IProfessionalProfile } from "../../model/professional/profesional.profile";
import { ProfessionalDashboardResponseDTO } from "./dahsboard.dtos.schema";
import { ProfessionalProfileResponseSchema } from "./dahsboard.dtos.schema";
import { injectable } from "inversify";
@injectable()
export class ProfessionalDashboardDtoMapper implements IProfessionalDashboardDtoMap {
  constructor() {}

  toDto(profile: IProfessionalProfile, profileUrl?: string): ProfessionalDashboardResponseDTO {
    const user = profile.userId as unknown as { _id: string; name: string; email: string };

    const dto = {
      id: profile._id.toString(),
      user: user
        ? { id: user._id.toString(), name: user.name, email: user.email }
        : { id: "", name: "", email: "" },
      bio: profile.bio ?? "",
      companyName: profile.companyName ?? "",
      experience: profile.experience ?? 0,
      rating: profile.rating ?? 0,
      profileUrl: profileUrl ?? "",
      sessionPrice: profile.sessionPrice ?? 0,
      skills: profile.skills || [],
      title: profile.title ?? "",
      totalSessions: profile.totalSessions ?? 0,
      typesOfSessions: profile.typesOfSessions || [],
      status: profile.status,
      rejectReason: profile.RejectReason ?? "",
    };

    return ProfessionalProfileResponseSchema.parse(dto);
  }
}
