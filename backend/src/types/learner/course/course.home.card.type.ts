import { ICourse } from "@/model/shared/course.model";
import { CategoryObjType, CreatedByPopulated } from "@/services/admin/admin.course.manage.service";

export type CoursePopulated = Omit<ICourse, "category" | "subCategory" | "createdBy"> & {
  category: CategoryObjType;
  subCategory?: CategoryObjType | null;
  createdBy: CreatedByPopulated;
};
