import { Redis } from 'redis-modules-sdk';

import { config } from '~/constants';

const { password, ...restConf } = config.redis;
const redisConfig: any = {
  ...restConf
};
if (password) {
  redisConfig.password = password;
}
let client: Redis;

export async function getRedisConnection() {
  if (!client) {
    // const useMockRedis = config.nodeEnv == "test" && process.env.FORCE_REAL_REDIS != "true";
    client = new Redis(redisConfig);
    client.connect();
  }
  return client;
}
