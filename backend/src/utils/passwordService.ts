import bcrypt from "bcrypt";
import { injectable } from "inversify";

export interface IpasswordService {
  hashPassword(password: string): Promise<string>;
  comparePassword: (hash: string, password: string) => Promise<boolean>;
}
@injectable()
export class PasswordService implements IpasswordService {
  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async comparePassword(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
