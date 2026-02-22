import { CreateAvailabilitySchemaType } from "@/schema/shared/availability/availability.create.schema";
import { AvailabilityResponseType } from "@/schema/shared/availability/availability.response.schema";
import { UpdateAvailabilitySchemaType } from "@/schema/shared/availability/availability.update.schema";

export interface IAvailabilityService {
  createAvailability: (
    instructorId: string,
    data: CreateAvailabilitySchemaType,
  ) => Promise<AvailabilityResponseType[]>;
  updateAvailability: (
    avlId: string,
    data: UpdateAvailabilitySchemaType,
  ) => Promise<AvailabilityResponseType[]>;
  removeAvailability: (avlId: string) => Promise<AvailabilityResponseType[]>;
  getAllAvailabilityOfInstructor: (instructorId: string, date: Date) => Promise<any>;
  getAllAvailabilityRules: (instructorId: string) => Promise<AvailabilityResponseType[]>;
}
