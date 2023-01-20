import HttpError from './HttpError';
import { HttpErrorOptions } from '../../../@types/errors';

export default class NotAuthorizedError extends HttpError {
	constructor(message: string, options: HttpErrorOptions) {
		super(message, {
			...options,
			code: 401,
		});
	}
}
