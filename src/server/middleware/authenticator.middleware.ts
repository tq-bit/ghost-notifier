import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import logger from '../util/logger.util';
import { AuthorizedRequest, UserJwtPayload } from '../../@types/authorization';
import { GN_COOKIE_NAME } from '../constants';
import Responder from '../util/responder.util';
import { GN_ERROR_STATUS } from '../constants';

function extractUserTokenFromRequest(req: Request) {
	return req.cookies[GN_COOKIE_NAME] || req.headers[GN_COOKIE_NAME];
}

export default {
	validateUserToken: (req: Request, res: Response, next: NextFunction) => {
		try {
			const userToken = extractUserTokenFromRequest(req);
			const userJwtPayload = jwt.verify(userToken, process.env.JWT_KEY || '') as UserJwtPayload;
			req = { ...req, userJwtPayload } as AuthorizedRequest;
			next();
		} catch (error) {
			logger.error(error);
			const status = error instanceof JsonWebTokenError ? 401 : 500;
			const message = 'You must login to view this information';
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(status).send({ status: GN_ERROR_STATUS, error: message }),
				onOther: () => res.redirect(`/login?status=${GN_ERROR_STATUS}&message=${message}`),
			}).send();
		}
	},
};
