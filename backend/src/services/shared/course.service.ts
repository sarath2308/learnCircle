import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICompressor } from "@/interface/shared/compressor.interface";
import ICourseRepo from "@/interface/shared/ICourseRepo";
import ICourseService from "@/interface/shared/ICourseService";
import { IS3Service } from "@/interface/shared/IS3Service";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";
import { createCourseDtoType } from "@/schema/shared/course.create.schema";
import { CoursePriceDtoType } from "@/schema/shared/course.pricing.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import fs from "fs";

@injectable()
export class CourceService implements ICourseService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.ImageCompressService) private _imageCompressService: ICompressor,
  ) {}
  //creating a course

  async createCourse(
    data: createCourseDtoType,
    thumbnail: UploadedFile,
  ): Promise<{ courseId: string }> {
    const createdCourse = await this._courseRepo.create(data);
    if (!createdCourse) {
      throw new AppError(Messages.COURSE_NOT_CREATED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const courseId = String(createdCourse._id);

    const compressedPath = await this._imageCompressService.compress(thumbnail.path);

    const key = await this._s3Service.generateS3Key(courseId, thumbnail.originalName);

    await this._s3Service.uploadFileFromStream(
      compressedPath,
      key,
      thumbnail.mimeType,
      Number(process.env.S3_URL_EXPIRES_IN),
    );

    await this._courseRepo.updateThumbnail(courseId, key);

    try {
      fs.unlinkSync(thumbnail.path);
      fs.unlinkSync(compressedPath);
    } catch (err) {
      console.error("Temp cleanup error:", err);
    }

    return { courseId };
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
  }
}
