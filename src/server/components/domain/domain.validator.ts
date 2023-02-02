import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { GN_ERROR_STATUS, GN_SUCCESS_STATUS, GN_WARNING_STATUS } from '../../../constants';
import { GhostWebhook } from '../../../@types/ghost';
import { AuthorizedRequest, DomainJwtPayload } from '../../../@types/authorization';
import { validateDomainForm } from '../../../@types/domain';
import DomainModel from '../../components/domain/domain.model';
import logger from '../../util/logger.util';
import Converter from '../../util/converter.util';
import Responder from '../../util/responder.util';
import NotPermittedError from '../../errors/http/NotPermitted';
import NotAuthorizedError from '../../errors/http/NotAuthorizedError';
import NotFoundError from '../../errors/http/NotFoundError';
import ValidationError from '../../errors/http/ValidationError';

export default {
	validateWebhookDomain: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			if (!req.query.key) {
				throw new NotAuthorizedError('Webhook URL did not include a key!');
			}
			const webhookPath = (req.body as GhostWebhook).post.current.url;
			const webhookKey = req.query.key as string;
			const domainKeyPayload = jwt.verify(
				webhookKey,
				process.env.JWT_KEY || ''
			) as DomainJwtPayload;

			const domainName = Converter.convertUrlToDomainName(webhookPath || '');
			const domainEntry = await DomainModel.getDomainByName(domainName);

			if (!domainEntry) {
				throw new NotFoundError(`Domain with ${domainName} not maintained!`);
			}

			if (domainEntry.name !== domainKeyPayload.domainName) {
				throw new NotPermittedError(
					`${domainKeyPayload.domainName} is not permitted to create notifications for ${domainEntry.name}`
				);
			}

			next();
		} catch (error) {
			if (
				error instanceof NotAuthorizedError ||
				error instanceof NotPermittedError ||
				error instanceof NotFoundError
			) {
				res.status(error.options.code).send({ error: error.message });
				return;
			}

			if (error instanceof JsonWebTokenError) {
				logger.error(error);
				res.status(401).send({ error: error.message });
				return;
			}

			logger.error(error);
			res.status(500).send({ error });
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

			if (domain.status === 'inactive') {
				throw new NotPermittedError(`Domain with id ${domainId} (${domain.name}) is not active!`);
			}

			// Append domain to body for usage in notificaiton.listener
			// TODO: This should happen stateless?
			req.body = domain;

			next();
		} catch (error) {
			if (
				error instanceof ValidationError ||
				error instanceof NotFoundError ||
				error instanceof NotPermittedError
			) {
				const {
					options: { code },
					message,
				} = error;
				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			logger.error(error);
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error: error }),
				onOther: () => res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	validateDomainOwner: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const domainId = req?.params?.id;
			if (!domainId) {
				throw new ValidationError('Domain must be specified!');
			}

			const domainOwner = (req as AuthorizedRequest).userJwtPayload?.email;
			if (!domainOwner) {
				throw new NotAuthorizedError(`Request to validate domain owner was not authorized!`);
			}
			const domain = await DomainModel.getDomainByIdAndOwner(domainId, domainOwner);
			if (!domain) {
				throw new NotFoundError(`Domain with id ${domainId} and owner ${domainOwner} not found!`);
			}

			next();
		} catch (error) {
			if (error instanceof NotAuthorizedError || error instanceof NotFoundError) {
				const {
					options: { code },
					message,
				} = error;
				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () =>
						res.redirect(`/my-domains/home?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			logger.error(error);
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error: error }),
				onOther: () => res.redirect(`/my-domains/home?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},
};
