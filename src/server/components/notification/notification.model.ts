import { Notification } from '../../../@types';
import { notificationCollection } from '../../db/dbClient';

export default {
	createNotification: (notification: Notification) => {
		return notificationCollection.insertOne(notification);
	},
	getNotificationById: (notificationId: string) => {
		return notificationCollection.findOne({ postId: notificationId });
	},
	updateNotificationById: (notification: Notification) => {
		return notificationCollection.replaceOne({ postId: notification.postId }, Notification);
	},
};
