import ICourseService from "../interface/ICourseService";

export class CourceService implements ICourseService {
  constructor() {}

  async createCourse(data: any): Promise<{ courseId: string } | void> {}
  async updatePriceDetails(data: any): Promise<void> {}
}
