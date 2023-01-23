import { Notification } from '../../../@types';
import { notificationCollection } from '../../db/dbClient';

export default {
	createNotification: (notification: Notification) => {
		return notificationCollection.insertOne(notification);
	},
	getNotificationById: (notificationId: string) => {
		return notificationCollection.findOne({ id: notificationId });
	},
	updateNotificationById: async (notification: Notification) => {
		return notificationCollection.replaceOne({ id: notification.id }, notification);
	},
};
