import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IInstructorReviewController } from "@/interface/shared/instuctor-review/instructor.review.controller";
import { IInstructorReviewService } from "@/interface/shared/instuctor-review/instructor.review.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class InstructorReviewController implements IInstructorReviewController {
  constructor(
    @inject(TYPES.IInstructorReviewService)
    private _instructorReviewService: IInstructorReviewService,
  ) {}
  async createReview(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.params.instructorId as string;
    const userId = req.user?.userId as string;
    const reviewData = await this._instructorReviewService.createReview(
      instructorId,
      userId,
      req.body,
    );
    res.status(HttpStatus.CREATED).json({ success: true, reviewData });
  }
  async editReview(req: IAuthRequest, res: Response): Promise<void> {
    const reviewId = req.params.reviewId as string;
    const reviewData = await this._instructorReviewService.editReview(reviewId, req.body);
    res.status(HttpStatus.OK).json({ success: true, reviewData });
  }
  async removeReview(req: IAuthRequest, res: Response): Promise<void> {
    const reviewId = req.params.reviewId as string;
    await this._instructorReviewService.deleteInstructorReview(reviewId);
    res.status(HttpStatus.OK).json({ success: true });
  }
  async getAllReview(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.params.instructorId as string;
    const reviewData = await this._instructorReviewService.getAllReviewOfInstructor(instructorId);
    res.status(HttpStatus.OK).json({ success: true, ...reviewData });
  }
}
