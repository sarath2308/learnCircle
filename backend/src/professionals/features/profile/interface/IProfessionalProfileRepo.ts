import { IBaseRepo } from "@/common/baseRepo";
import { IProfessionalProfile } from "../models/profesional.profile";
import { AggregatedProfessionalProfile } from "../types/AggregatedProfessionalProfile";

export interface IProfessionalProfileRepo extends IBaseRepo<IProfessionalProfile> {
  getProfile: (id: string) => Promise<IProfessionalProfile | null>;
  getAllProfile: (page: number, search: string) => Promise<AggregatedProfessionalProfile[] | []>;
  countAll: (search: string) => Promise<number>;
}
