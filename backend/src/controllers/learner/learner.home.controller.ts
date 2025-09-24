import { LearnerHomeService } from "../../services/learner/learner.home.service.ts";
import { TYPES } from "../../types/types.js";
import { inject, injectable } from "inversify";
@injectable()
export class LearnerHomeController {
  constructor(@inject(TYPES.LearnerHomeService) private service: LearnerHomeService) {}
}
