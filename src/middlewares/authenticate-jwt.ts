import { NextFunction, Request, Response } from 'express';
import service from '../services/auth.service';
import { constants } from 'http2';
import { HttpError } from '../classes/http-error';

export const authenticateJwt = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = request.headers.authorization;
  if (authorization) {
    const token = authorization.split(' ')[1];
    const valid = await service.checkToken(token);
    if (valid) {
      const user = service.getTokenData(token);
      request.body = { ...request.body, tokenData: user };
      next();
    } else {
      response
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .send(
          new HttpError(constants.HTTP_STATUS_UNAUTHORIZED, 'Usuário expirado!')
        );
    }
  }
};
