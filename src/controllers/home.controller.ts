import { FastifyReply } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { FTSARequest } from '../models';
import { sendSuccessResponse } from '../utils/response.utils';

@Controller({ route: '/' })
export default class HomeController {
  @GET({ url: '/' })
  async indexHandler(req: FTSARequest, res: FastifyReply) {
    return sendSuccessResponse(res);
  }
}
