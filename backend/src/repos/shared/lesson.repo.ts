import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import ILessonRepo from "@/interface/shared/ILessonRepo";
import { ILesson } from "@/model/shared/lesson.model";

@injectable()
export class LessonRepo extends BaseRepo<ILesson> implements ILessonRepo {
  constructor(@inject(TYPES.ILessonModel) private _model: Model<ILesson>) {
    super(_model);
  }
}
