


export interface IRedisRepository<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export class RedisRepository<T> implements IRedisRepository<T> {
  constructor(private client: any) {}

  async get(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(error);
      throw new Error("Data not found");
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.client.set(key, stringValue, "EX", ttl);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while setting data to Redis");
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while deleting data from Redis");
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
