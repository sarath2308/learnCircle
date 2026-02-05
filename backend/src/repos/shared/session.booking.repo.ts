import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { ISessionBooking } from "@/model/shared/session.booking.model";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class SessionBookingRepo extends BaseRepo<ISessionBooking> implements ISessionBookingRepo {
  constructor(@inject(TYPES.ISessionBooking) private _sessionBookingModel: Model<ISessionBooking>) {
    super(_sessionBookingModel);
  }
}
