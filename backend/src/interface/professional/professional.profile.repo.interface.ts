import { IBaseRepo } from "@/repos/shared/base";
import { IProfessionalProfile } from "@/model/professional/professional.profile";
import { AggregatedProfessionalProfile } from "@/types/professional/AggregatedProfessionalProfile";

export interface IProfessionalProfileRepo extends IBaseRepo<IProfessionalProfile> {
  getProfile: (id: string) => Promise<IProfessionalProfile | null>;
  getAllProfileForAdmin: (
    page: number,
    search: string,
  ) => Promise<AggregatedProfessionalProfile[] | []>;
  countAll: (search: string) => Promise<number>;
  getAllProfileForUser: (
    page: number,
    search: string,
  ) => Promise<AggregatedProfessionalProfile[] | []>;
}
