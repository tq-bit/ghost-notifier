import { Request, Response } from 'express';
import DomainModel from './domain.model';
import ConflictError from '../../errors/http/ConflictError';
import Responder from '../../util/responder.util';
import Converter from '../../util/converter.util';

export default {
	handleDomainCreation: async (req: Request, res: Response) => {
		try {
			const owner = 't.quante@outlook.com';
			const ownedDomain = Converter.convertDomainFormToOwnedDomain(req.body, owner);

			const existingEntry = await DomainModel.getDomainByName(ownedDomain.name);

			if (existingEntry) {
				throw new ConflictError(`Domain with name ${ownedDomain.name} already exists`);
			}

			await DomainModel.createDomain(ownedDomain);

			const status = 'success';
			const message = `Domain ${ownedDomain.name} created successfully`;
			const responder = new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(201).send({ status: status, message: message }),
				onOther: () => res.redirect(`/my-domains?status=${status}&message=${message}`),
			});

			responder.send();
		} catch (error) {
			const status = 'error';

			if (error instanceof ConflictError) {
				const {
					options: { code },
					message,
				} = error;

				const responder = new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: status, error: message }),
					onOther: () => res.redirect(`/my-domains?status=${status}&message=${message}`),
				});
				return responder.send();
			}

			const responder = new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: status, error }),
				onOther: () => res.redirect(`my-domains?status=${status}&message=${error}`),
			});
			return responder.send();
		}
	},

	getDomainsByOwner: async (req: Request, res: Response) => {
		const ownedDomains = await DomainModel.getDomainsByOwner('t.quante@outlook.com');

		const responder = new Responder(req.headers['content-type'] || 'text/html', {
			onJson: () => res.status(200).send(ownedDomains),
			onOther: () => res.redirect(`/my-domains`),
		});

		responder.send();
	},
};
