import { TYPES } from "@/types/shared/inversify/types";
import { injectable, inject } from "inversify";
import { ILearnerHomeService } from "@/interface/learner/ILearnerHomeService";
import { IUserRepo } from "@/repos/shared/user.repo";
@injectable()
export class LearnerHomeService implements ILearnerHomeService {
  constructor(@inject(TYPES.IUserRepo) private _userepo: IUserRepo) {}
  async getHome(userId: string): Promise<void> {}
}
