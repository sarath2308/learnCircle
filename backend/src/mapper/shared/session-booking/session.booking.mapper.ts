import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { ISessionBooking } from "@/model/shared/session.booking.model";
import {
  SessionBookingResponseSchema,
  SessionBookingResponseType,
} from "@/schema/learner/session.booking/session.booking.response.schema";
import { injectable } from "inversify";

@injectable()
export class SessionBookingMapper implements IMapper<ISessionBooking, SessionBookingResponseType> {
  map(input: ISessionBooking): SessionBookingResponseType {
    const responseObj = {
      id: String(input._id),
      instructorId: String(input.instructorId),
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      price: input.price,
      typeOfSession: input.typeOfSession,
      status: input.status,
    };

    return SessionBookingResponseSchema.parse(responseObj);
  }
}
