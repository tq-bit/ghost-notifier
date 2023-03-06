import { Request, Response } from 'express';
import DomainModel from './domain.model';
import ConflictError from '../../errors/http/ConflictError';
import Responder from '../../util/responder.util';
import Converter from '../../util/converter.util';
import NotFoundError from '../../errors/http/NotFoundError';
import { DomainStatus } from '../../../@types';
import { GN_ERROR_STATUS, GN_SUCCESS_STATUS } from '../../../constants';
import { AuthorizedRequest } from '../../../@types/authorization';

export default {
	handleDomainCreation: async (req: Request, res: Response) => {
		try {
			const owner = (req as AuthorizedRequest).userJwtPayload.email;
			const ownedDomain = Converter.convertDomainFormToOwnedDomain(req.body, owner);

			const existingEntry = await DomainModel.getDomainByIdAndOwner(ownedDomain.name, owner);

			if (existingEntry) {
				throw new ConflictError(`Domain with name ${ownedDomain.name} already exists`);
			}

			await DomainModel.createDomain(ownedDomain);

			const message = `Domain ${ownedDomain.name} created successfully`;
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(201).send({ status: GN_SUCCESS_STATUS, message: message }),
				onOther: () => res.redirect(`/my-domains?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof ConflictError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/my-domains?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`my-domains?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	handleWebhookGeneration: async (req: Request, res: Response) => {
		console.log(req.body);
		res.send('OK');
	},

	handleDomainStatusToggle: async (req: Request, res: Response) => {
		try {
			const domainEntry = await DomainModel.getDomainById(req.params.id);

			if (!domainEntry) {
				throw new NotFoundError(`Domain with ID ${req.params.id} not found`);
			}

			const updatedDomainEntry = {
				...domainEntry,
				status:
					domainEntry.status === DomainStatus.Active ? DomainStatus.Inactive : DomainStatus.Active,
			};

			// @ts-ignore
			await DomainModel.updateDomainById(req.params.id, updatedDomainEntry);

			const message = `Domain ${domainEntry.name} set to ${updatedDomainEntry.status}`;

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
				onOther: () => res.redirect(`/my-domains?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof NotFoundError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/my-domains?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`/my-domains?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	getDomainsByOwner: async (req: Request, res: Response) => {
		const ownedDomains = await DomainModel.getDomainsByOwner('t.quante@outlook.com');

		return new Responder(req.headers['content-type'] || 'text/html', {
			onJson: () => res.status(200).send(ownedDomains),
			onOther: () => res.redirect(`/my-domains`),
		}).send();
	},

	handleDomainDeletion: async (req: Request, res: Response) => {
		try {
			const domainEntry = await DomainModel.getDomainById(req.params.id);

			if (!domainEntry) {
				throw new NotFoundError(`Domain with ID ${req.params.id} not found`);
			}

			await DomainModel.deleteDomainById(req.params.id);

			const message = `Domain ${domainEntry.name} deleted`;
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
				onOther: () => res.redirect(`/my-domains?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof NotFoundError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/my-domains?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`my-domains?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	disableAllDomains: async (req: Request, res: Response) => {
		try {
			const domainOwner = (req as AuthorizedRequest).userJwtPayload.email;
			const ownedDomains = await DomainModel.getDomainsByOwner(domainOwner);
			if (ownedDomains.length === 0) {
				throw new NotFoundError(`No domains found for ${domainOwner}`);
			}

			await DomainModel.bulkSetDomainStatusByOwner(domainOwner, DomainStatus.Inactive);

			const message = `Disabled notifications for ${ownedDomains.length} domain(s)`;
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
				onOther: () => res.redirect(`/settings?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof NotFoundError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/settings?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`/settings?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},
};
