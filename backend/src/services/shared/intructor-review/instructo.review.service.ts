import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { IInstructorReviewRepo } from "@/interface/shared/instuctor-review/instructor.review.repo.interface";
import { IInstructorReviewService } from "@/interface/shared/instuctor-review/instructor.review.service.interface";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IInstructorReview } from "@/model/shared/insturctor.review.mode";
import { InstructorReviewResponseType } from "@/schema/shared/review/instructor-review/instructor.review.response.schema";
import { CreateReviewBodyType } from "@/schema/shared/review/review..create.body.schema";
import { UpdateReviewBodyType } from "@/schema/shared/review/review.update.body.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class InstructorReviewService implements IInstructorReviewService {
  constructor(
    @inject(TYPES.IInstructorReviewRepo) private _instructorReviewRepo: IInstructorReviewRepo,
    @inject(TYPES.IInstructorReviewDtoMapper)
    private _instructorReviewMapper: IMapper<IInstructorReview, InstructorReviewResponseType>,
    @inject(TYPES.IProfessionalProfileService)
    private _professionalProfileService: IProfessionalProfileService,
  ) {}
  async createReview(
    instructorId: string,
    userId: string,
    data: CreateReviewBodyType,
  ): Promise<InstructorReviewResponseType> {
    const instuctorObjId = new mongoose.Types.ObjectId(instructorId);
    const learnerObjId = new mongoose.Types.ObjectId(userId);

    const reviewData = await this._instructorReviewRepo.create({
      instructorId: instuctorObjId,
      learnerId: learnerObjId,
      ...data,
    });

    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_CREATED, HttpStatus.BAD_REQUEST);
    }
    const { averageRating } =
      await this._instructorReviewRepo.findAverageRatingOfInstructor(instructorId);
    await this._professionalProfileService.updateRating(instructorId, averageRating);

    return this._instructorReviewMapper.map(reviewData);
  }

  async editReview(
    reviewId: string,
    data: UpdateReviewBodyType,
  ): Promise<InstructorReviewResponseType> {
    const reviewData = await this._instructorReviewRepo.findById(reviewId);
    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    reviewData.rating = data.rating ?? reviewData.rating;
    reviewData.comment = data.comment ?? reviewData.comment;
    await reviewData.save();

    const { averageRating } = await this._instructorReviewRepo.findAverageRatingOfInstructor(
      String(reviewData.instructorId),
    );
    await this._professionalProfileService.updateRating(
      String(reviewData.instructorId),
      averageRating,
    );

    return this._instructorReviewMapper.map(reviewData);
  }
  async getAllReviewOfInstructor(
    instructorId: string,
  ): Promise<{ reviews: InstructorReviewResponseType[]; averageRating: number }> {
    const { reviews, averageRating } =
      await this._instructorReviewRepo.findAllReviewOfInstructor(instructorId);

    const responseObj = reviews.map((review) => this._instructorReviewMapper.map(review));

    return { reviews: responseObj, averageRating };
  }
  async deleteInstructorReview(reviewId: string): Promise<void> {
    const reviewData = await this._instructorReviewRepo.findById(reviewId);
    if (!reviewData) {
      throw new AppError(Messages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    reviewData.isDeleted = true;
    await reviewData.save();

    const { averageRating } = await this._instructorReviewRepo.findAverageRatingOfInstructor(
      String(reviewData.instructorId),
    );
    await this._professionalProfileService.updateRating(
      String(reviewData.instructorId),
      averageRating,
    );
  }
}
