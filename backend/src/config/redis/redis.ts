import { createClient } from 'redis';
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.REDIS_PORT)
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host:process.env.REDIS_HOST,
        port:Number(process.env.REDIS_PORT)
    }
});

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

export default redisClient;



