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

			const successStatus = 'success';
			const successMessage = `Domain ${ownedDomain.name} created successfully`;
			const responder = new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(201).send({ status: successStatus, message: successMessage }),
				onOther: () =>
					res.redirect(`/my-domains?status=${successStatus}&message=${successMessage}`),
			});

			responder.send();
		} catch (error) {
			error instanceof ConflictError
				? res.status(error.options.code).send({ error: error.message })
				: res.status(500).send(error);
		}
	},
};
