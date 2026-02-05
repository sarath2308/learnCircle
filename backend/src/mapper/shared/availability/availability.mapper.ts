import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IAvailability } from "@/model/shared/availability.model";
import {
  AvailabilityResponseSchema,
  AvailabilityResponseType,
} from "@/schema/shared/availability/availability.response.schema";
import { injectable } from "inversify";

@injectable()
export class AvailabilityMapper implements IMapper<IAvailability, AvailabilityResponseType> {
  map(input: IAvailability): AvailabilityResponseType {
    const responseObj = {
      id: String(input._id),
      instructorId: String(input.instructorId),
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      slotDuration: input.slotDuration,
      price: input.price,
      isActive: input.isActive,
    };
    return AvailabilityResponseSchema.parse(responseObj);
  }
}
