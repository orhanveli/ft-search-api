import { resolve } from 'path';

import fastify from 'fastify';
import { bootstrap } from 'fastify-decorators';
import helmet from 'fastify-helmet';

import { getUserDecorator } from '~/fastify';
import { config } from '~/constants';

export const fastifyInstance = fastify({
  logger: config.app.env == 'development'
});

export const server = async () => {
  await fastifyInstance.register(bootstrap, {
    // Specify directory with our controllers
    directory: resolve(__dirname, 'controllers'),
    // Specify mask to match only our controllers
    mask: /\.controller\.ts$/
  });
  await fastifyInstance.register(helmet, { contentSecurityPolicy: false });
  // await app.register(middie);
  fastifyInstance.addContentTypeParser('application/json', { parseAs: 'string' }, function (_, body, done) {
    try {
      const json = JSON.parse(body as string);
      done(null, json);
    } catch (err) {
      err.statusCode = 500;
      done(err, undefined);
    }
  });
  await fastifyInstance.register(getUserDecorator);
  const port = config.app.port;
  try {
    await fastifyInstance.listen(port);
    // fastifyInstance.log.info(`Server is up and running at http://127.0.0.1:${port}`);
  } catch (err) {
    fastifyInstance.log.error(err);
    // process.exit(1);
  }
  return fastifyInstance;
};
