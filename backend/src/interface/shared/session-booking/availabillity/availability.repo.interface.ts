import { IAvailability } from "@/model/shared/availability.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface IAvailabilityRepo extends IBaseRepo<IAvailability> {
  getAllAvailabilityWithInstructorId: (instructorId: string) => Promise<IAvailability[]>;
  removeAvailability: (avlId: string) => Promise<void>;
  findById: (avlId: string) => Promise<IAvailability | null>;
  getAvailabilityByInstructorAndDay: (
    instructorId: string,
    dayOfWeek: number,
  ) => Promise<IAvailability | null>;
}
