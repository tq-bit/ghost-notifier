import HttpError from './HttpError';
export default class NotAuthorizedError extends HttpError {
  constructor(message: string) {
    super(message, {
      code: 401,
    });
  }
}
