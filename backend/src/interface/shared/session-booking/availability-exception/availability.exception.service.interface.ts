export interface IAvailabilityExceptionService {
  createException: (instructorId: string, availabilityId: string, data: any) => Promise<any>;
  removeException: (exceptionId: string) => Promise<any>;
  listException?: () => Promise<any>;
}
