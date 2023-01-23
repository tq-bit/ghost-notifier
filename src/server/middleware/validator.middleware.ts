import { Request, Response, NextFunction } from 'express';
import { GhostWebhook, validateGhostWebhook } from '../../@types/ghost';
import { validateDomainForm } from '../../@types/domain';
import DomainModel from '../components/domain/domain.model';
import ValidationError from '../errors/http/ValidationError';
import NotFoundError from '../errors/http/NotFoundError';

import logger from '../util/logger.util';

export default {
	validateWebhookDomain: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const webhookPath = (req.body as GhostWebhook).post.current.url;
			const pathPaths = webhookPath.split('/');
			const protocol = pathPaths[0];
			const hostname = pathPaths[2];
			const domainName = `${protocol}//${hostname}`;

			const domainEntry = await DomainModel.getDomainByName(domainName);

			if (!domainEntry) {
				throw new NotFoundError(`Domain with ${domainName} not maintained!`);
			}

			next();
		} catch (error) {
			error instanceof NotFoundError
				? res.status(error.options.code).send({ error: error.message })
				: () => {
						logger.error(error);
						res.status(500).send({ error });
				  };
		}
	},
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
			const validation = validateDomainForm(req.body);

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
