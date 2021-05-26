import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { jwtVerify } from '~/utils/jwt.utils';

export async function getUser(app: FastifyInstance) {
  app.decorateRequest('user', null);

  app.addHook('onRequest', async (req: any) => {
    if (!req || !req.headers || !req.headers.authorization) {
      return;
    }

    const bearerSplit = String(req.headers.authorization).split(' ');
    if (bearerSplit.length !== 2 || bearerSplit[0] !== 'Bearer') {
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-var
      const { iat, exp, ...rest } = await jwtVerify(bearerSplit[1]);
      req.user = {
        ...rest
      };
    } catch (error) {
      console.error(error);
    }
  });
}

export const getUserDecorator = fp(getUser);
