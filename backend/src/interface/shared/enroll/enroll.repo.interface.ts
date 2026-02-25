import { IEnroll } from "@/model/shared/enroll";
import { IBaseRepo } from "@/repos/shared/base";

export interface IEnrollRepo extends IBaseRepo<IEnroll> {
  findByUserAndCourse: (userId: string, courseId: string) => Promise<IEnroll | null>;
  revokeEnrollment: (userId: string, courseId: string) => Promise<void>;
}
