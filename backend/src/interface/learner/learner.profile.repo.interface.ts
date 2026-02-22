import { IBaseRepo } from "@/repos/shared/base";
import { ILearnerProfile } from "@/model/learner/learner.profile.model";
import { AggregatedLearnerProfile } from "@/types/learner/AggregatedLearnerProfile";

export interface ILearnerProfileRepo extends IBaseRepo<ILearnerProfile> {
  /**
   *
   * @param id
   * @param key
   * @returns
   */
  storeProfileKey: (id: string, key: string) => Promise<void>;
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

  getAllProfile: (page: number, search: string) => Promise<AggregatedLearnerProfile[] | []>;
  countAll: (search: string) => Promise<number>;
}
