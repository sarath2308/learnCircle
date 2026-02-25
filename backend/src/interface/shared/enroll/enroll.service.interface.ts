export interface IEnrollmentService {
  isEnrolled: (userId: string, courseId: string) => Promise<boolean>;
  enroll: (userId: string, courseId: string) => Promise<void>;
  revoke: (userId: string, courseId: string) => Promise<void>;
}
