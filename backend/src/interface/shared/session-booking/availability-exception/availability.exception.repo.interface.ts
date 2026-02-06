import { IAvailabilityException } from "@/model/shared/availability.exception.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface IAvailabilityExceptionRepo extends IBaseRepo<IAvailabilityException> {
  removeException: (exId: string) => Promise<void>;
  listExceptionOfInstructor: (instructorId: string) => Promise<IAvailabilityException[]>;
}
