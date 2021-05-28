import express, { Request, Response } from 'express';
import service from '../services/auth.service';
import { HttpError } from '../classes/http-error';
import { constants } from 'http2';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

const app = express();

app.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await service.register(req.body);
    res.send(user);
  } catch (e) {
    if (e.code === 'P2002') {
      res
        .status(constants.HTTP_STATUS_PRECONDITION_FAILED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_PRECONDITION_FAILED,
            'E-mail já cadastrado!'
          )
        );

      return;
    }

    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const user = await service.login(req.body);
    if (user) {
      const token = await service.generateToken(user);
      res.send(token);
    } else {
      res
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_UNAUTHORIZED,
            'E-mail ou senha inválidos'
          )
        );
    }
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.delete('/logout', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const user = req.body.tokenData;
    if (user) {
      await service.logout(user.id);
      res.send();
    }
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

export default app;
