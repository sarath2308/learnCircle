import { inject, injectable } from "inversify";
import ILessonService from "../interface/ILessonService";
import { TYPES } from "../types/inversify/types";
import ILessonRepo from "../interface/ILessonRepo";
@injectable()
export class LessonService implements ILessonService {
  constructor(@inject(TYPES.ILessonRepo) private _lessonRepo: ILessonRepo) {}
}
