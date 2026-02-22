import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { ICourseReviewController } from "@/interface/shared/course-review/course.review.controller.interface";
import { ICourseReviewService } from "@/interface/shared/course-review/course.review.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class CourseReviewController implements ICourseReviewController {
  constructor(
    @inject(TYPES.ICourseReviewService) private _courseReviewService: ICourseReviewService,
  ) {}

  async createReview(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const courseId = req.params.courseId as string;
    const reviewData = await this._courseReviewService.createCourseReview(
      courseId,
      userId,
      req.body,
    );
    res.status(HttpStatus.CREATED).json({ success: true, reviewData });
  }
  async removeReview(req: IAuthRequest, res: Response): Promise<void> {
    const reviewId = req.params.reviewId as string;
    await this._courseReviewService.deleteCourseReview(reviewId);
    res.status(HttpStatus.OK).json({ success: true });
  }
  async getAllReview(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId as string;
    const reviewData = await this._courseReviewService.getCourseReviews(courseId);
    res.status(HttpStatus.OK).json({ success: true, ...reviewData });
  }
  async editReview(req: IAuthRequest, res: Response): Promise<void> {
    const reviewId = req.params.reviewId as string;
    const reviewData = await this._courseReviewService.updateCourseReview(reviewId, req.body);
    res.status(HttpStatus.OK).json({ success: true, reviewData });
  }
}
