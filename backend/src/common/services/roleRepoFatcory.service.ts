import { injectable, multiInject } from "inversify";
import { IRepoRole, TYPES } from "@/common";

export interface IRepositoryFactory {
  getRepository: (role: string) => Promise<IRepoRole>;
}
@injectable()
export class RepositoryFactory implements IRepositoryFactory {
  constructor(@multiInject(TYPES.IUserRepo) private repos: IRepoRole[]) {}

  async getRepository(role: string): Promise<IRepoRole> {
    const repo = this.repos.find((r) => r.role === role);
    if (!repo) throw new Error(`No repository found for role: ${role}`);
    return repo;
  }
}
