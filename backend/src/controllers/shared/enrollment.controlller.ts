import { HttpStatus } from "@/constants/shared/httpStatus";
import { ICoursePurchaseService } from "@/interface/shared/course-purchase/course.purchase.service.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";
import { IEnrollmentController } from "@/interface/shared/enroll/enrollment.controller.interface";

@injectable()
export class EnrollmentController implements IEnrollmentController {
  constructor(
    @inject(TYPES.ICoursePurchaseService) private _coursePurchaseService: ICoursePurchaseService,
  ) {}

  async enroll(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const courseId = req.params.courseId as string;
    const response = await this._coursePurchaseService.startPurchase(userId, courseId);
    res
      .status(HttpStatus.OK)
      .json({ success: true, status: response.status, orderData: response.order });
}
}
