import { IBaseRepo } from "@/repos/shared/base";
import { IProfessionalProfile } from "@/model/professional/professional.profile";
import { AggregatedProfessionalProfile } from "@/types/professional/AggregatedProfessionalProfile";
import { IProfessionalDocumentResponse } from "@/types/professional/professional.profile.type";

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

  getProfileOfInstructor: (instructorId: string) => Promise<IProfessionalDocumentResponse | null>;
  updateRating: (instructorId: string, rating: number) => Promise<void>;
  increaseSessionCount: (instructorId: string) => Promise<void>;
  getProfileByInstructorId: (instructorId: string) => Promise<IProfessionalProfile | null>;
}
