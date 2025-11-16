export default interface ICourseService {
  createCourse: (data: any) => Promise<{ courseId: string } | void>;
  updatePriceDetails: (data: any) => Promise<void>;
}
