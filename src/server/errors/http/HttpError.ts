import { HttpErrorOptions } from '../../../@types/errors';
import logger from '../../util/logger.util';

export default class HttpError extends Error {
  options: HttpErrorOptions;

  constructor(message: string, options: HttpErrorOptions) {
    super(message);

    this.options = options;
    Object.setPrototypeOf(this, new.target.prototype);
    this.log(message);
  }

  private log(message: string) {
    logger.error(`${this.options.code} - ${message}`);
  }
}
