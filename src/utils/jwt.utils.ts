import * as jwt from 'jsonwebtoken';

import { config } from '~/constants';
import { FTSAJwtPayload } from '~/models';

/**
 * Encryp the payload as a JWT
 * @param {string} payload
 */
export const jwtSign = async (payload: any, extraOptions?: jwt.SignOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options = {
      ...(config.auth.jwt.signOptions as jwt.SignOptions),
      ...(extraOptions ?? {})
    };
    jwt.sign(payload, config.auth.jwt.secret, options, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      if (!token) {
        reject('token sign error!');
        return;
      }
      resolve(token);
    });
  });
};

/**
 * Decodes given JWT and return the payload
 * @param {string} token
 */
export const jwtVerify = async (token: string): Promise<FTSAJwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.auth.jwt.secret,
      {
        ...(config.auth.jwt.signOptions as jwt.VerifyOptions)
      },
      (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload as any);
      }
    );
  });
};
