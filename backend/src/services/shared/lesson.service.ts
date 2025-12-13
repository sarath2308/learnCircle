import { inject, injectable } from "inversify";
import ILessonService from "@/interface/shared/lesson/ILessonService";
import ILessonRepo from "@/interface/shared/lesson/ILessonRepo";
import { TYPES } from "@/types/shared/inversify/types";
@injectable()
export class LessonService implements ILessonService {
  constructor(@inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo) {}
}
