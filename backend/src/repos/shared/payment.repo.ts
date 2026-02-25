import { IPayment } from "@/model/shared/payments";
import { BaseRepo } from "./base";
import { IPaymentRepo } from "@/interface/shared/payment/payment.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { PAYMENT_STATUS } from "@/constants/shared/paymnet.status";
@injectable()
export class PaymentRepo extends BaseRepo<IPayment> implements IPaymentRepo {
  constructor(@inject(TYPES.IPayment) private _paymentModel: Model<IPayment>) {
    super(_paymentModel);
  }

  async getPaymentWithOrderId(orderId: string): Promise<IPayment | null> {
    return await this._paymentModel.findOne({ orderId: orderId });
  }

  async markFailed(paymentId: string, orderId: string): Promise<void> {
    await this._paymentModel.updateOne(
      { _id: paymentId, orderId: orderId },
      { $set: { status: PAYMENT_STATUS.FAILED } },
    );
  }
  async markPaid(paymentId: string, orderId: string): Promise<void> {
    await this._paymentModel.updateOne(
      { _id: paymentId, orderId: orderId },
      { $set: { status: PAYMENT_STATUS.PAID } },
    );
  }
}
