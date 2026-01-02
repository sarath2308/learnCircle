import { ILessonController } from "@/interface/shared/lesson/lesson.controller.interface";
import { inject, injectable } from "inversify";
import { Response } from "express";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import ILessonService from "@/interface/shared/lesson/lesson.service.interface";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { LESSON_TYPES } from "@/constants/shared/lessonType";

@injectable()
export class LessonController implements ILessonController {
  constructor(@inject(TYPES.ILessonService) private _lessonService: ILessonService) {}

  async createLesson(req: IAuthRequest, res: Response): Promise<void> {
    const { chapterId } = req.params;
    const userId = req.user?.userId!;
    const lessonDto = req.body;
    const type = req.body.type;

    if (type === LESSON_TYPES.PDF) {
      if (!req.files || !req.files["resource"]) {
        throw new AppError(Messages.RESOURCE_FILE_MISSING, HttpStatus.BAD_REQUEST);
      }
    }

    if (!req.files || !req.files["thumbnail"]) {
      throw new AppError(Messages.THUMBNAIL_FILE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const resourceData = req.files["resource"];
    const thumbnailData = req.files["thumbnail"];

    const lessonResponse = await this._lessonService.createLesson(
      chapterId,
      userId!,
      lessonDto,
      resourceData,
      thumbnailData,
    );

    res.status(HttpStatus.CREATED).json({ success: true, lessonData: lessonResponse });
  }

  async getLessonById(req: IAuthRequest, res: Response): Promise<void> {
    const { lessonId } = req.params;

    const lesson = await this._lessonService.getLessonById(lessonId);
    res.status(HttpStatus.OK).json({ success: true, lesson });
  }

  async updateLesson(req: IAuthRequest, res: Response): Promise<void> {
    const { lessonId } = req.params;
    const lessonDto = req.body;
    await this._lessonService.updateLesson(lessonId, lessonDto);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async deleteLesson(req: IAuthRequest, res: Response): Promise<void> {
    const { lessonId } = req.params;
    await this._lessonService.deleteLesson(lessonId);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async createLessonWithVideo(req: IAuthRequest, res: Response): Promise<void> {
    const { chapterId } = req.params;
    const userId = req.user?.userId!;
    const lessonDto = req.body;

    if (!req.files || !req.files["thumbnail"]) {
      throw new AppError(Messages.THUMBNAIL_FILE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const thumbnailData = req.files["thumbnail"];

    const { preSignedUrl, lessonId } = await this._lessonService.createLessonWithVideo(
      chapterId,
      userId,
      lessonDto,
      thumbnailData,
    );
    res.status(HttpStatus.CREATED).json({ success: true, preSignedUrl, lessonId });
  }
  async changeLessonOrder(req: IAuthRequest, res: Response): Promise<void> {}

  async finalizeLessonVideo(req: IAuthRequest, res: Response): Promise<void> {
    const { lessonId } = req.params;
    const lessonData = await this._lessonService.finalizeLessonVideo(lessonId);
    res.status(HttpStatus.OK).json({ success: true, lessonData });
  }
}
