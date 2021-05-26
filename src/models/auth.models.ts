import { FastifyRequest } from 'fastify';

export interface FTSAJwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export interface FTSAJwtUser {
  deviceId: string;
  id?: string; // User id
}

export interface FTSARequest extends FastifyRequest {
  user: FTSAJwtUser;
}
