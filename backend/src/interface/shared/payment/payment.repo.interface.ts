import { IPayment } from "@/model/shared/payments";
import { IBaseRepo } from "@/repos/shared/base";

export interface IPaymentRepo extends IBaseRepo<IPayment> {}
