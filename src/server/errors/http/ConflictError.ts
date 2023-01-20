import HttpError from './HttpError';
import { HttpErrorOptions } from '../../../@types/errors';

export default class ValidationError extends HttpError {
	constructor(message: string) {
		super(message, {
			code: 409,
		});
	}
}
