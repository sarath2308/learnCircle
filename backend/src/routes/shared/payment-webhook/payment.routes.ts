import { IPaymentController } from "@/interface/shared/payment/payment.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { PaymentParamsSchema } from "@/schema/shared/payment/payment.order.param.schema";
import { Router } from "express";
import express from "express";

export const PaymentRoute = (controller: IPaymentController) => {
  const router = Router();

  router.post(
    "/webhooks/razorpay",
    express.raw({ type: "application/json" }),
    controller.handleWebHook.bind(controller),
  );

  router.post(
    "/:orderId/status",
    validateRequest(PaymentParamsSchema),
    controller.checkPaymentStatus.bind(controller),
  );

  return router;
};
