import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IPaymentController } from "@/interface/shared/payment/payment.controller.interface";
import { IPaymentService } from "@/interface/shared/payment/payment.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(@inject(TYPES.IPaymentService) private _paymentService: IPaymentService) {}

  async handleWebHook(req: IAuthRequest, res: Response): Promise<void> {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      res.status(400).send("Missing signature");
    }
    await this._paymentService.handleWebhook(req.body, signature);

    res.status(200).json({ status: "ok" });
  }
  async checkPaymentStatus(req: IAuthRequest, res: Response): Promise<void> {
    const orderId = req.params.orderId as string;
    const status = await this._paymentService.getPaymentStatus(orderId);
    res.status(HttpStatus.OK).json({ success: true, paymentStatus: status });
  }
}
