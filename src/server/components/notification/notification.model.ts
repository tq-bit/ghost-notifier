import { Notification } from '../../../@types';
import { notificationCollection } from '../../db/dbClient';

export default {
	createNotification: (notification: Notification) => {
		return notificationCollection.insertOne(notification);
	},
	getNotificationById: (notificationId: string) => {
		return notificationCollection.findOne({ id: notificationId });
	},

	getNotificationByGhostId: (ghostId: string) => {
		return notificationCollection.findOne({ ghostId: ghostId });
	},

	getNotificationsByDomainName: async (domainName: string) => {
		const cursor = notificationCollection.find({ ghostOriginalUrl: { $regex: domainName } });
		let results: any = [];
		await cursor.forEach((entry) => results.push(entry));

		return Promise.all(results) as Promise<Notification[]>;
	},

	updateNotificationById: async (notification: Notification) => {
		return notificationCollection.replaceOne({ id: notification.id }, notification);
	},

	deleteNotificationByGhostId: (ghostId: string) => {
		return notificationCollection.deleteMany({ ghostId: ghostId });
	},

	deleteNotificationsByDomainName: (domainName: string) => {
		return notificationCollection.deleteMany({ ghostOriginalUrl: { $regex: domainName } });
	},
};
