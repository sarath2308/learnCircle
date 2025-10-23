import { IBaseRepo } from "@/common/baseRepo";
import { ILearnerProfile } from "../model/learner.profile.model";

export interface ILearnerProfileRepo extends IBaseRepo<ILearnerProfile> {
  /**
   *
   * @param id
   * @param key
   * @returns
   */
  storeProfileKey: (id: string, key: string) => Promise<ILearnerProfile | null>;
  /**
   *
   * @param id
   * @param subject
   * @returns
   */
  addSubject: (id: string, subject: string) => Promise<ILearnerProfile | null>;
  /**
   *
   * @param id
   * @returns
   */
  findByUserId: (id: string) => Promise<ILearnerProfile | null>;
  /**
   *
   * @param userId
   * @returns
   */
  updateLastLogin: (userId: string) => Promise<ILearnerProfile | null>;
}
