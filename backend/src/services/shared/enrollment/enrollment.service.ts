import { IEnrollRepo } from "@/interface/shared/enroll/enroll.repo.interface";
import { IEnrollmentService } from "@/interface/shared/enroll/enroll.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject } from "inversify";
import mongoose from "mongoose";

export class EnrollmentService implements IEnrollmentService {
  constructor(@inject(TYPES.IEnrollRepo) private _enrollRepo: IEnrollRepo) {}

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this._enrollRepo.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      return false;
    }
    return true;
  }
  async enroll(userId: string, courseId: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    await this._enrollRepo.create({
      userId: userObjectId,
      courseId: courseObjectId,
    });
  }
  async revoke(userId: string, courseId: string): Promise<void> {
    await this._enrollRepo.revokeEnrollment(userId, courseId);
  }
}
