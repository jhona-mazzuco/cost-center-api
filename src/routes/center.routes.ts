import express, { Request, Response } from 'express';
import { authenticateJwt } from '../middlewares/authenticate-jwt';
import service from '../services/center.service';
import { constants } from 'http2';
import { HttpError } from '../classes/http-error';

const app = express();

app.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const center = await service.create(req.body, req.body.tokenData?.id);
    res.send(center);
  } catch (e) {
    if (e.code === 'P2002') {
      res
        .status(constants.HTTP_STATUS_PRECONDITION_FAILED)
        .send(
          new HttpError(
            constants.HTTP_STATUS_PRECONDITION_FAILED,
            'Centro de custo já cadastrado!'
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

app.get('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const centers = await service.find(
      req.body.tokenData.id,
      req.query?.query as string
    );
    res.send(centers);
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.get('/:ïd', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const center = await service.findById(id);
    res.send(center);
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
    const name = req.body.name;
    const center = await service.update(id, name);
    res.send(center);
  } catch (e) {
    console.error(e);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(new HttpError());
  }
});

app.delete('/:ïd', authenticateJwt, async (req: Request, res: Response) => {
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
