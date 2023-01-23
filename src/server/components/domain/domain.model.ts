import { OwnedDomain } from '../../../@types';
import { domainCollection } from '../../db/dbClient';

export default {
	createDomain: (domain: OwnedDomain) => {
		return domainCollection.insertOne(domain);
	},

	getDomainByName: (domainName: string) => {
		return domainCollection.findOne({ name: domainName });
	},

	getDomainsByOwner: async (ownerName: string) => {
		const cursor = domainCollection.find({ owner: ownerName });
		let results: any = [];
		await cursor.forEach((entry) => results.push(entry));

		return Promise.all(results) as Promise<OwnedDomain[]>;
	},
};
