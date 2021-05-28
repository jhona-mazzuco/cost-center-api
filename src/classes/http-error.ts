import { constants } from 'http2';

export class HttpError {
  code: number;
  message: string;

  constructor(
    code = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message = 'Ocorreu algum erro, tente novamente mais tarde!'
  ) {
    this.code = code;
    this.message = message;
  }
}
