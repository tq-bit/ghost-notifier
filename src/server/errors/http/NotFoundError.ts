import HttpError from './HttpError';
import { HttpErrorOptions } from '../../../@types/errors';

export default class NotFoundError extends HttpError {
	constructor(message: string) {
		super(message, {
			code: 404,
		});
	}
}
