import { AvailabilityExceptionResponseType } from "@/schema/shared/availability/exception/exceptionResponse.schem";

export interface IAvailabilityExceptionService {
  createException: (instructorId: string, date: Date) => Promise<AvailabilityExceptionResponseType>;
  removeException: (exceptionId: string) => Promise<AvailabilityExceptionResponseType>;
  listException: (instructorId: string) => Promise<AvailabilityExceptionResponseType[]>;
  getExceptionForInstructorWithDate: (
    instructorId: string,
    date: Date,
  ) => Promise<AvailabilityExceptionResponseType | null>;
}
