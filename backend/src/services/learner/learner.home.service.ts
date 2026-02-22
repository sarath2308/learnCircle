import { TYPES } from "@/types/shared/inversify/types";
import { injectable, inject } from "inversify";
import { ILearnerHomeService } from "@/interface/learner/learner.home.service.interface";
import { IUserRepo } from "@/repos/shared/user.repo";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { ICategoryService } from "@/interface/shared/category/category.service.interface";
import { CategoryDto } from "@/schema/shared/category/category.response.schema";
import { userCourseCardResponseType } from "@/schema/learner/course/course.home.response";
import { ILearnerProfileService } from "@/interface/learner/learner.profile.service.interface";
import { LearnerProfileDTOType } from "@/schema/learner/profile.response.dto";

@injectable()
export class LearnerHomeService implements ILearnerHomeService {
  constructor(
    @inject(TYPES.IUserRepo) private _userepo: IUserRepo,
    @inject(TYPES.ILearnerProfileService) private _learnerProfileService: ILearnerProfileService,
    @inject(TYPES.ICourseService) private _courseService: ICourseService,
    @inject(TYPES.ICategoryService) private _categoryService: ICategoryService,
  ) {}
  async getHome(userId: string): Promise<{
    categoryData: CategoryDto[];
    courseCardData: userCourseCardResponseType[];
    userData: LearnerProfileDTOType | null;
  }> {
    const userData = await this._learnerProfileService.getProfile(userId);
    const courseCardData = await this._courseService.getCourseDataForUserHome();
    const categoryData = await this._categoryService.getCategoryForUser();
    return { courseCardData, categoryData, userData: userData };
  }
}
