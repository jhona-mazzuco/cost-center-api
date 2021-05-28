import express, { Request, Response } from 'express';
import service from '../services/auth.service';
import { HttpError } from '../classes/http-error';
import { constants } from 'http2';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

const app = express();

app.post('/register', async (request: Request, response: Response) => {
  try {
    await service.register(request.body);
    response.send();
  } catch (e) {
    if (e.code === 'P2002') {
      response
        .status(constants.HTTP_STATUS_PRECONDITION_FAILED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_PRECONDITION_FAILED,
            'E-mail já cadastrado!'
          )
        );
    }
  }
});

app.post('/login', async (request: Request, response: Response) => {
  try {
    const user = await service.login(request.body);
    if (user) {
      const token = await service.generateToken(user);
      response.send(token);
    } else {
      response
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_UNAUTHORIZED,
            'E-mail ou senha inválidos'
          )
        );
    }
  } catch (e) {
    response
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send(
        new HttpError(
          constants.HTTP_STATUS_BAD_REQUEST,
          'Ocorreu um erro, tente novamente mais tarde!'
        )
      );
  }
});

app.delete(
  '/logout',
  authenticateJwt,
  async (request: Request, response: Response) => {
    const authorization = request.headers.authorization;
    if (authorization) {
      const token = authorization.split(' ')[1];
      await service.logout(token);
      response.send();
    } else {
      response
        .status(constants.HTTP_STATUS_PRECONDITION_FAILED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_PRECONDITION_FAILED,
            'Ocorreu um erro, tente novamente mais tarde!'
          )
        );
    }
  }
);

export default app;
