import { ILearnerCourseService } from "@/interface/learner/learner.course.interface";
import { IChapterService } from "@/interface/shared/chapter/chapter.service.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import ILessonService from "@/interface/shared/lesson/lesson.service.interface";
import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { LearnerAllCourseRequestType } from "@/schema/learner/course/learner.course.get.all.schema";
import { LearnerCourseResponse } from "@/types/learner/course/learner.course.type";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class LearnerCourseService implements ILearnerCourseService {
  constructor(
    @inject(TYPES.ICourseService) private _courseService: ICourseService,
    @inject(TYPES.IChapterService) private _chapterService: IChapterService,
    @inject(TYPES.ILessonService) private _lessonService: ILessonService,
  ) {}

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
