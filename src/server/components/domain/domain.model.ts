import { DomainStatus, OwnedDomain } from '../../../@types';
import { domainCollection } from '../../db/dbClient';

export default {
  createDomain: (domain: OwnedDomain) => {
    return domainCollection.insertOne(domain);
  },

  getDomainById: (domainId: string) => {
    return domainCollection.findOne({ id: domainId });
  },

  getDomainByName: (domainName: string) => {
    return domainCollection.findOne({ name: domainName });
  },

  getDomainByIdAndOwner(domainId: string, domainOwner: string) {
    return domainCollection.findOne({ id: domainId, owner: domainOwner });
  },

  getDomainsByOwner: async (ownerName: string): Promise<OwnedDomain[]> => {
    const cursor = domainCollection.find({ owner: ownerName });
    const results: any = [];
    await cursor.forEach((entry) => results.push(entry));

    return Promise.all(results) as Promise<OwnedDomain[]>;
  },

  updateDomainById: (domainId: string, domainEntry: OwnedDomain) => {
    return domainCollection.updateOne({ id: domainId }, { $set: domainEntry });
  },

  deleteDomainById: (domainId: string) => {
    return domainCollection.deleteOne({ id: domainId });
  },

  updateMany: (domainEntries: OwnedDomain[]) => {
    return domainCollection.updateMany({}, { $set: domainEntries });
  },

  bulkSetDomainStatusByOwner(ownerName: string, status: DomainStatus) {
    return domainCollection.updateMany(
      { owner: ownerName },
      { $set: { status } },
    );
  },
};
