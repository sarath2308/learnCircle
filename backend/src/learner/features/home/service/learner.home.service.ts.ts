import { LearnerRepo } from "@/learner";
import { TYPES } from "@/common";
import { injectable, inject } from "inversify";
@injectable()
export class LearnerHomeService {
  constructor(@inject(TYPES.LearnerRepo) private learnerRepo: LearnerRepo) {}
}
