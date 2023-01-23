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

	updateNotificationById: async (notification: Notification) => {
		return notificationCollection.replaceOne({ id: notification.id }, notification);
	},
};
