import { TYPES } from "../../../../common/types/inversify/types";
import { injectable, inject } from "inversify";
import { ILearnerHomeService } from "../interface/ILearnerHomeService";
import { IUserRepo } from "@/common/Repo";
@injectable()
export class LearnerHomeService implements ILearnerHomeService {
  constructor(@inject(TYPES.IUserRepo) private _userepo: IUserRepo) {}
  async getHome(userId: string): Promise<void> {}
}
