import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export async function connectRedis() {
  const rawPort = process.env.REDIS_PORT;
  const host = process.env.REDIS_HOST;
  const password = process.env.REDIS_PASSWORD;

  const port = Number(rawPort);

  if (!host) {
    throw new Error(`Invalid REDIS_HOST: "${host}"`);
  }

  if (!rawPort || Number.isNaN(port)) {
    throw new Error(`Invalid REDIS_PORT: "${rawPort}"`);
  }

  if (!redisClient) {
    redisClient = createClient({
      username: "default",
      password,
      socket: {
        host,
        port,
      },
    });

    redisClient.on("connect", () => console.log("✅ Redis connected"));
    redisClient.on("error", (err) => console.error("❌ Redis error:", err));
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }
  return redisClient;
}
