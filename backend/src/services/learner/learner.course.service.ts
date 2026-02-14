import { ILearnerCourseService } from "@/interface/learner/learner.course.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";
import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class LearnerCourseService implements ILearnerCourseService {
  constructor(@inject(TYPES.ICourseService) private _courseService: ICourseService) {}

  async getCourseData(courseId: string, userId: string): Promise<LearnerCourseResponse> {
    let courseData = await this._courseService.getCourseDataForLearner(courseId);

    return courseData;
  }

  async getAllCourseData(
    filter: LearnerAllCourseRequestType,
  ): Promise<userCourseCardResponseType[]> {
    return await this._courseService.getAllCourseForUser(filter);
  }
}
