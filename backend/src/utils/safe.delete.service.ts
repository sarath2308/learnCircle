import fs from "fs/promises";
import { injectable } from "inversify";

export interface ISafeDeleteService {
  safeDelete(filePath: string): Promise<void>;
}
@injectable()
export class SafeDeleteService implements ISafeDeleteService {
  async safeDelete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(err);
    }
  }
}
