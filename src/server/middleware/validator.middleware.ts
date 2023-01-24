import { Request, Response, NextFunction } from 'express';
import { GhostWebhook, validateGhostWebhook } from '../../@types/ghost';
import { validateDomainForm } from '../../@types/domain';
import DomainModel from '../components/domain/domain.model';
import ValidationError from '../errors/http/ValidationError';
import NotFoundError from '../errors/http/NotFoundError';

import logger from '../util/logger.util';
import Converter from '../util/converter.util';
import NotPermittedError from '../errors/http/NotPermitted';

export default {
	validateWebhookDomain: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const webhookPath = (req.body as GhostWebhook).post.current.url;
			const domainName = Converter.convertUrlToDomainName(webhookPath);
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

	validateDomainStatus: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const domainId = req?.params?.id;
			if (!domainId) {
				throw new ValidationError('Domain must be specified!');
			}

			const domain = await DomainModel.getDomainById(domainId);

			if (!domain) {
				throw new NotFoundError(`Domain with id ${domainId} not found!`);
			}

			// @ts-ignore
			if (domain.status === 'inactive') {
				throw new NotPermittedError(`Domain with id ${domainId} (${domain.name}) is not active!`);
			}

			// Append domain to body for usage in notificaiton.listener
			req.body = domain;

			next();
		} catch (error) {
			// TODO: Add Transponder here for HTML Form Request
			if (
				error instanceof ValidationError ||
				error instanceof NotFoundError ||
				error instanceof NotPermittedError
			) {
				return res.status(error.options.code).send({ error: error.message });
			}

			logger.error(error);
			res.status(500).send({ error });
		}
	},
};
