import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICourseReviewRepo } from "@/interface/shared/course-review/course.review.interface";
import { ICourseReviewService } from "@/interface/shared/course-review/course.review.service.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { ICourseReview } from "@/model/shared/course.review.model";
import { CourseReviewResponseType } from "@/schema/shared/review/course-review/course.review.response.schema";
import { CreateReviewBodyType } from "@/schema/shared/review/review..create.body.schema";
import { UpdateReviewBodyType } from "@/schema/shared/review/review.update.body.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class CourseReviewService implements ICourseReviewService {
  constructor(
    @inject(TYPES.ICourseReviewRepo) private _courseReviewRepo: ICourseReviewRepo,
    @inject(TYPES.ICourseReviewMapper)
    private _courseReviewMapper: IMapper<ICourseReview, CourseReviewResponseType>,
    @inject(TYPES.ICourseService) private _courseService: ICourseService,
  ) {}

  async createCourseReview(
    courseId: string,
    learnerId: string,
    data: CreateReviewBodyType,
  ): Promise<CourseReviewResponseType> {
    const existingReview = await this._courseReviewRepo.findByCourseAndLearner?.(
      courseId,
      learnerId,
    );
    if (existingReview) {
      existingReview.rating = data.rating;
      existingReview.comment = data.comment ?? existingReview.comment;
      await existingReview.save();

      return this._courseReviewMapper.map(existingReview);
    }
    const courseObjId = new mongoose.Types.ObjectId(courseId);
    const learnerObjId = new mongoose.Types.ObjectId(learnerId);

    const reviewData = await this._courseReviewRepo.create({
      courseId: courseObjId,
      learnerId: learnerObjId,
      ...data,
    });
    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_CREATED, HttpStatus.BAD_REQUEST);
    }
    const { averageRating } = await this._courseReviewRepo.findAverageRating(courseId);
    await this._courseService.updateAverageRating(courseId, averageRating);
    return this._courseReviewMapper.map(reviewData);
  }

  async updateCourseReview(
    reviewId: string,
    data: UpdateReviewBodyType,
  ): Promise<CourseReviewResponseType> {
    const reviewData = await this._courseReviewRepo.findById(reviewId);
    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    reviewData.rating = data.rating ?? reviewData.rating;
    reviewData.comment = data.comment ?? reviewData.comment;
    await reviewData.save();
    const { averageRating } = await this._courseReviewRepo.findAverageRating(
      String(reviewData.courseId),
    );
    await this._courseService.updateAverageRating(String(reviewData.courseId), averageRating);
    return this._courseReviewMapper.map(reviewData);
  }
  async getCourseReviews(
    courseId: string,
  ): Promise<{ averageRating: number; reviews: CourseReviewResponseType[] }> {
    const { reviews, averageRating } =
      await this._courseReviewRepo.getAllReviewsAndAverageByCourseId(courseId);
    const responseObj = reviews.map((review) => {
      return this._courseReviewMapper.map(review);
    });

    return { reviews: responseObj, averageRating };
  }
  async deleteCourseReview(reviewId: string): Promise<void> {
    const reviewData = await this._courseReviewRepo.findById(reviewId);
    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    reviewData.isDeleted = true;
    await reviewData.save();
    const { averageRating } = await this._courseReviewRepo.findAverageRating(
      String(reviewData.courseId),
    );
    await this._courseService.updateAverageRating(String(reviewData.courseId), averageRating);
  }
}
