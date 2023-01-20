import HttpError from './HttpError';
import { HttpErrorOptions } from '../../../@types/errors';

export default class ServerError extends HttpError {
	constructor(message: string, options: HttpErrorOptions) {
		super(message, {
			...options,
			code: 500,
		});
	}
}
