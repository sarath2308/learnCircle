import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICompressor } from "@/interface/shared/compressor.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";
import { createCourseDtoType } from "@/schema/shared/course/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course/course.pricing.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import {
  courseResponseSchema,
  courseResponseType,
} from "@/schema/shared/course/course.response.schema";
import { ISafeDeleteService } from "@/utils/safe.delete.service";

@injectable()
export class CourseService implements ICourseService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.ImageCompressService) private _imageCompressService: ICompressor,
    @inject(TYPES.ISafeDeleteService) private _safeDeleteService: ISafeDeleteService,
  ) {}
  //creating a course

  async createCourse(
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ): Promise<{ courseId: string }> {
    let compressedPath: string | null = null;

    try {
      const present = await this._courseRepo.getCourseWithTitle(data.title);
      if (present) {
        throw new AppError(Messages.COURSE_DUPLICATE, HttpStatus.BAD_REQUEST);
      }
      let subCategoryId: mongoose.Types.ObjectId | undefined = undefined;
      if (data.subCategory) {
        subCategoryId = new mongoose.Types.ObjectId(data.subCategory);
      }
      const categoryObjectId = new mongoose.Types.ObjectId(data.category);

      const createdCourse = await this._courseRepo.create({
        ...data,
        category: categoryObjectId,
        subCategory: subCategoryId,
      });

      if (!createdCourse) {
        throw new AppError(Messages.COURSE_NOT_CREATED, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const courseId = String(createdCourse._id);

      compressedPath = await this._imageCompressService.compress(thumbnail.path);
      console.log("COMPRESSED PATH:", compressedPath);
      const key = await this._s3Service.generateS3Key(courseId, thumbnail.originalName);
      console.log("GENERATED KEY:", key);
      await this._s3Service.uploadFileFromStream(
        compressedPath,
        key,
        thumbnail.mimeType,
        Number(process.env.S3_URL_EXPIRES_IN),
      );

      await this._courseRepo.updateThumbnail(courseId, key);

      return { courseId };
    } finally {
      await this._safeDeleteService.safeDelete(thumbnail.path);
      if (compressedPath) {
        await this._safeDeleteService.safeDelete(compressedPath);
      }
    }
  }

  async editCourse(courseId: string, payload: Partial<createCourseDtoType>): Promise<void> {
    const categoryObjectId = new mongoose.Types.ObjectId(payload.category);
    let subCategoryId: mongoose.Types.ObjectId | undefined = undefined;
    if (payload.subCategory) {
      subCategoryId = new mongoose.Types.ObjectId(payload.subCategory);
    }
    let updated = await this._courseRepo.update(courseId, {
      ...payload,
      category: categoryObjectId,
      subCategory: subCategoryId,
    });
    if (!updated) {
      throw new AppError(Messages.COURSE_NOT_UPDATED, HttpStatus.NOT_MODIFIED);
    }
  }

  /*updating course price details*/

  async updatePriceDetails(id: string, data: CoursePriceDtoType): Promise<void> {
    const courseData = await this._courseRepo.findById(id);
    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (data.type === "Paid") {
      await this._courseRepo.updatePrice(id, {
        price: Number(data.price || 0),
        discount: Number(data.discount || 0),
        type: data.type,
      });
    }
    if (data.status === "published") {
      courseData.status = "published";
      await courseData.save();
    }
  }

  async getCourseDataForCourseCreation(courseId: string): Promise<courseResponseType> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const responseObject = {
      ...courseData,
      id: courseData._id,
    };
    return courseResponseSchema.parse(responseObject);
  }

  async getAllCourse(): Promise<any> {
    return await this._courseRepo.getAll();
  }

  async getCourseDataForUserHome(): Promise<void> {}
  async getCouseDataForCourseManagement(): Promise<void> {}
}
