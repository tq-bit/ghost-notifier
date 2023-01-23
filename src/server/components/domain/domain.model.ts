import { OwnedDomain } from '../../../@types';
import { domainCollection } from '../../db/dbClient';

export default {
	createDomain: (domain: OwnedDomain) => {
		return domainCollection.insertOne(domain);
	},

	getDomainByName: (domainName: string) => {
		return domainCollection.findOne({ name: domainName });
	},
};
