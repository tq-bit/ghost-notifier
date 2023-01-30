import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(process.env.MONGO_HOST as string, {
	serverApi: ServerApiVersion.v1,
});

export const ghostDb = client.db('ghost');

export const notificationCollection = ghostDb.collection('notifications');
export const domainCollection = ghostDb.collection('domains');
export const userCollection = ghostDb.collection('users');

export default client;
