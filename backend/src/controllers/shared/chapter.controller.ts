import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IChapterController } from "@/interface/shared/chapter/chapter.controller.interface";
import { IChapterService } from "@/interface/shared/chapter/chapter.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class ChapterController implements IChapterController {
  constructor(@inject(TYPES.IChapterService) private _chapterService: IChapterService) {}

  async createChapter(req: IAuthRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    console.log(
      "Received request to create chapter for courseId:",
      courseId,
      "with body:",
      req.body,
    );
    let result = await this._chapterService.createChapter(courseId, req.body);
    res.status(HttpStatus.OK).json({ success: true, chapterData: result });
  }

  async editChapter(req: IAuthRequest, res: Response): Promise<void> {
    const { chapterId } = req.params;
    let result = await this._chapterService.editChapter(chapterId, req.body);
    res.status(HttpStatus.OK).json({ success: true, chapterData: result });
  }

  async removeChapter(req: IAuthRequest, res: Response): Promise<void> {
    const { chapterId } = req.params;
    await this._chapterService.removeChapter(chapterId);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
