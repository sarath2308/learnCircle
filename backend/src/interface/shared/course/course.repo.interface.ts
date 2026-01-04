import { ICourse } from "@/model/shared/course.model";
import { IBaseRepo } from "@/repos/shared/base";

export default interface ICourseRepo extends IBaseRepo<ICourse> {
  updatePrice: (
    id: string,
    payload: { price: number; discount: number; type: "Free" | "Paid" },
  ) => Promise<void>;

  updateThumbnail: (id: string, key: string) => Promise<void>;
  getCourseWithTitle: (title: string) => Promise<ICourse | null>;
  increaseChapterCount:(courseId:string) => Promise<ICourse | null>;
  decreaseChapterCount:(courseId: string) => Promise<ICourse |  null>;
  getAllCourse: (skip:number,limit:number) => Promise<ICourse[] | null>;
}
