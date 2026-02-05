import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SessionBookingService implements ISessionBookingService {
  constructor(
    @inject(TYPES.ISessionBookingRepo) private _sessionBookingRepo: ISessionBookingRepo,
  ) {}
  async bookSession(data: any): Promise<any> {}
}
