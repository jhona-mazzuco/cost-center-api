import express, { Request, Response } from 'express';
import service from '../services/auth.service';
import { HttpError } from '../classes/http-error';
import { constants } from 'http2';

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
    const token = await service.login(request.body);
    if (token) {
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
    console.log(e);
  }
});

export default app;
