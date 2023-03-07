import { MongoClient, ServerApiVersion } from 'mongodb';
import { Notification, OwnedDomain } from '../../@types';
import { User } from '../../@types/user';

const client = new MongoClient(process.env.MONGO_HOST as string, {
  serverApi: ServerApiVersion.v1,
});

export const ghostDb = client.db('ghost');

export const notificationCollection =
  ghostDb.collection<Notification>('notifications');
export const domainCollection = ghostDb.collection<OwnedDomain>('domains');
export const userCollection = ghostDb.collection<User>('users');

export default client;
