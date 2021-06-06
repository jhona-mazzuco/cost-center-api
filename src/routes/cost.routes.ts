import express, { Request, Response } from 'express';
import { authenticateJwt } from '../middlewares/authenticate-jwt';
import service from '../services/cost.service';
import { constants } from 'http2';
import { HttpError } from '../classes/http-error';

const app = express();

app.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const cost = await service.create(req.body);
    res.send(cost);
  } catch (e) {
    if (e.code === 'P2002') {
      res
        .status(constants.HTTP_STATUS_PRECONDITION_FAILED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_PRECONDITION_FAILED,
            'Custo já cadastrado!'
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

app.get('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const cost = await service.findById(id);
    res.send(cost);
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.put('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const center = await service.update(id, req.body);
    res.send(center);
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.delete('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    await service.remove(id);
    res.send();
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

export default app;
