import { server, fastifyInstance } from '~/server';
import { getRedisConnection } from '~/utils/redis.utils';

async function main() {
  try {
    const redisConnection = await getRedisConnection();
    redisConnection.redis.on('connect', async () => {
      fastifyInstance.log.info('Redis has been connected!');

      await server();
      fastifyInstance.log.info('server has started!');
    });
  } catch (error) {
    fastifyInstance.log.error(error);
  }
}

main();
