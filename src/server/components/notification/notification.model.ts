import { NotificationEntry } from '../../../@types/notifier';
import { notificationCollection } from '../../db/dbClient';

export default {
	createNotification: (notificationEntry: NotificationEntry) => {
		return notificationCollection.insertOne(notificationEntry);
	},
	getNotificationById: (notificationId: string) => {
		return notificationCollection.findOne({ postId: notificationId });
	},
	updateNotificationById: (notificationEntry: NotificationEntry) => {
		return notificationCollection.replaceOne(
			{ postId: notificationEntry.postId },
			notificationEntry
		);
	},
};
