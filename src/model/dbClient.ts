import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(process.env.MONGO_HOST as string, {
	serverApi: ServerApiVersion.v1,
});

export const articleDb = client.db('ghost');

export const notificationCollection = articleDb.collection('notifications');

export default client;
