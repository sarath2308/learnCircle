// db/DatabaseFactory.ts
import type { Idatabase } from './Idatabase.js';
import { MongoDB } from './mongo/mongo.js';

export function createDatabase(type: string, config: any): Idatabase {
  const map: Record<string, () => Idatabase> = {
    mongodb: () => new MongoDB(config.uri),
  };

  const dbCreator = map[type];
  if (!dbCreator) throw new Error(`Unsupported DB type: ${type}`);
  return dbCreator();
}
