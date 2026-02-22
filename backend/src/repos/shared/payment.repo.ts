import { IPayment } from "@/model/shared/payments";
import { BaseRepo } from "./base";
import { IPaymentRepo } from "@/interface/shared/payment/payment.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
@injectable()
export class PaymentRepo extends BaseRepo<IPayment> implements IPaymentRepo {
  constructor(@inject(TYPES.IPayment) private _paymentModel: Model<IPayment>) {
    super(_paymentModel);
  }
}
