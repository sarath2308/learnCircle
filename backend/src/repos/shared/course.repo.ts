import { inject, injectable } from "inversify";
import ICourseRepo from "@/interface/shared/ICourseRepo";
import { ICourse } from "@/model/shared/course.model";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { BaseRepo } from "./base";

@injectable()
export class CourseRepo extends BaseRepo<ICourse> implements ICourseRepo {
  constructor(@inject(TYPES.ICourseModel) private _model: Model<ICourse>) {
    super(_model);
  }
}
