import { RedisClientType } from "redis";

export interface IRedisRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export class RedisRepository implements IRedisRepository {
  constructor(private readonly getClient: () => RedisClientType) {}

  async get<T>(key: string): Promise<T | null> {
    const client = this.getClient();
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get data from Redis");
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const client = this.getClient();
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await client.set(key, stringValue, { EX: ttl }); // redis v4 style
      } else {
        await client.set(key, stringValue);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while setting data to Redis");
    }
  }

  async delete(key: string): Promise<void> {
    const client = this.getClient();
    try {
      await client.del(key);
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while deleting data from Redis");
    }
  }

  async exists(key: string): Promise<boolean> {
    const client = this.getClient();
    try {
      const exists = await client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
