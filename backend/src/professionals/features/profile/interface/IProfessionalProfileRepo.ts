import { IBaseRepo } from "@/common/baseRepo";
import { IProfessionalProfile } from "../models/profesional.profile";

export interface IProfessionalProfileRepo extends IBaseRepo<IProfessionalProfile> {
  getProfile: (id: string) => Promise<IProfessionalProfile | null>;
  getAllProfile: () => Promise<IProfessionalProfile[] | null>;
}
