import { ICourse } from "@/model/shared/course.model";
import { IBaseRepo } from "@/repos/shared/base";

export default interface ICourseRepo extends IBaseRepo<ICourse> {
  updatePrice: (
    id: string,
    payload: { price: number; discount: number; type: "Free" | "Paid" },
  ) => Promise<void>;

  updateThumbnail: (id: string, key: string) => Promise<void>;
  getCourseWithTitle: (title: string) => Promise<ICourse | null>;
}
