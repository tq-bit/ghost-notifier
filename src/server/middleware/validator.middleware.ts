import { Request, Response, NextFunction } from 'express';
import { validateGhostWebhook } from '../../@types/ghost';
import { DomainForm, validateDomainForm } from '../../@types/domain';
import ValidationError from '../errors/http/ValidationError';

import logger from '../util/logger.util';

export default {
	validateGhostWebhook: (req: Request, res: Response, next: NextFunction): void => {
		try {
			const validation = validateGhostWebhook(req.body);
			if (validation.result !== true) {
				throw new ValidationError(JSON.stringify(validation.errors));
			}

			next();
		} catch (error) {
			error instanceof ValidationError
				? res.status(error.options.code).send({ error: error.message })
				: () => {
						logger.error(error);
						res.status(500).send({ error });
				  };
		}
	},

	validateDomainEntry: (req: Request, res: Response, next: NextFunction): void => {
		try {
			console.log(req.headers);
			const validation = validateDomainForm(req.query as DomainForm);

			if (validation.result !== true) {
				throw new ValidationError(JSON.stringify(validation.errors));
			}

			next();
		} catch (error) {
			error instanceof ValidationError
				? res.status(error.options.code).send({ error: error.message })
				: () => {
						logger.error(error);
						res.status(500).send({ error });
				  };
		}
	},
};
