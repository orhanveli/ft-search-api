import { FastifyReply } from 'fastify';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { responseCodes } from '~/constants';

export const sendErrorResponse = (res: FastifyReply, data: any, code = StatusCodes.BAD_REQUEST) => {
  res.code(code);
  res.send(data);
};

export const badRequestResponse = (res: FastifyReply, message: string | string[]) => {
  sendErrorResponse(
    res,
    {
      code: ReasonPhrases.BAD_REQUEST,
      error: Array.isArray(message) ? message : [message]
    },
    StatusCodes.BAD_REQUEST
  );
};

export const sendSuccessResponse = (res: FastifyReply, data?: any) => {
  res.code(StatusCodes.OK);
  res.send(
    data
      ? {
          ...responseCodes.success,
          ...data
        }
      : responseCodes.success
  );
};
