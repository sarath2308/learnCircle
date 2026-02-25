import { IPaymentController } from "@/interface/shared/payment/payment.controller.interface";
import { Router } from "express";
import express from "express";

export const PaymentWebhookRoute = (controller: IPaymentController) => {
  const router = Router();

  router.post(
    "/razorpay",
    (req, res, next) => {
      console.log("🔥 WEBHOOK ROUTE REACHED");
      next();
    },
    express.raw({ type: "application/json" }),
    controller.handleWebHook.bind(controller),
  );

  return router;
};
