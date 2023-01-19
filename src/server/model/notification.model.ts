import { NotificationEntry } from '../../@types/notifier';
import { notificationCollection } from './dbClient';

async function createNotificationEntry(notificationEntry: NotificationEntry) {
	return notificationCollection.insertOne(notificationEntry);
}

async function getNotificationById(notificationId: string) {
	return notificationCollection.findOne({ postId: notificationId });
}

async function updateNotificationById(notificationEntry: NotificationEntry) {
	return notificationCollection.replaceOne({ postId: notificationEntry.postId }, notificationEntry);
}

export default {
	createNotificationEntry,
	getNotificationById,
	updateNotificationById,
};
