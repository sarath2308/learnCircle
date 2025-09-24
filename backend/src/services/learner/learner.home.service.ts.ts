import { LearnerRepo } from "../../Repositories/learner/learnerRepo";
import { TYPES } from "../../types/types";
import { injectable, inject } from "inversify";
@injectable()
export class LearnerHomeService {
  constructor(@inject(TYPES.LearnerRepo) private learnerRepo: LearnerRepo) {}
}
