import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import {
  CourseDetailsResponseType,
  courseDetailsSchema,
} from "@/schema/admin/course/course.details";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
@injectable()
export class AdminCourseManagementService implements IAdminCourseManagementService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo,
    @inject(TYPES.IChapterRepo) private _chapterRepo: IChapterRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
  ) {}

  async getAllCourseData(page: number, limit: number): Promise<CourseDetailsResponseType[]> {
    const skip = (page - 1) * limit;
    const courseData = await this._courseRepo.getAllCourse(skip, limit);

    if (!courseData || courseData.length === 0) {
      return [];
    }

    const mappedResponse = await Promise.all(
      courseData.map(async (course) => {
        const courseObj = course.toObject();

        const thumbnailUrl = courseObj.thumbnail_key
          ? await this._s3Service.getFileUrl(courseObj.thumbnail_key)
          : undefined;

        const shapedObj = {
          id: courseObj._id,
          title: courseObj.title,
          status: courseObj.status,
          createdBy: courseObj.createdBy?.name,
          createdAt: courseObj.createdAt,
          chapterCount: courseObj.chapterCount,
          thumbnailUrl,
        };

        return courseDetailsSchema.parse(shapedObj);
      }),
    );

    return mappedResponse;
  }

  async getCourseDetails(courseId: string): Promise<any> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const chapter = await this._chapterRepo.getChapters(courseId);
  }

  async approveCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.status = "approved";
    await courseData.save();
  }

  async rejectCourse(courseId: string, reason: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.status = "rejected";
    courseData.rejectReason = reason;
    await courseData.save();
  }

  async blockCourse(courseId: string, reason: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.isBlocked = true;
    courseData.blockedReason = reason;
    await courseData.save();
  }

  async unblockCourse(courseId: string): Promise<void> {
    const courseData = await this._courseRepo.findById(courseId);

    if (!courseData) {
      throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    courseData.isBlocked = false;
    courseData.blockedReason = "";
    await courseData.save();
  }
}
