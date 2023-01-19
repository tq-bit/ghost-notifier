import { Request, Response } from 'express';
import { GhostPost, GhostArticle, NotificationEntry, AppResponseMessage } from '../../@types';

import NotificationModel from '../model/notification.model';
import logger from '../util/logger.util';

function _assembleIncomingArticle(req: Request) {
	const incomingPost = req.body as GhostPost;
	console.log(incomingPost);
	return incomingPost.post.current as GhostArticle;
}

function _assembleNotificationEntry(incomingArticle: GhostArticle): NotificationEntry {
	return {
		postId: incomingArticle.id,
		postOriginalUrl: incomingArticle.url,
		postPrimaryTag: incomingArticle.primary_tag?.slug || '',
		postTitle: incomingArticle.title,
		postVisibility: incomingArticle.visibility,
	};
}

async function handlePostCreationNotification(req: Request, res: Response) {
	try {
		const incomingArticle = _assembleIncomingArticle(req);

		// Check for duplicated entry
		const duplicatedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

		const notificationEntry = _assembleNotificationEntry(incomingArticle);

		// Assemble notification entry and try to save
		if (!!duplicatedEntry) {
			logger.verbose(`Updating notification with postId ${incomingArticle.id}`);
			await NotificationModel.updateNotificationById(notificationEntry);
		} else {
			logger.verbose(`Notification created with postId ${incomingArticle.id}`);
			await NotificationModel.createNotificationEntry(notificationEntry);
		}

		return res.status(200).send('OK');

		// Catch serverside errors
	} catch (error) {
		logger.error(`Could not create new notification: ${error}`);
		return res.status(500).send({
			msg: 'The server encountered an unexpected error',
			error: true,
			params: error,
		}) as AppResponseMessage;
	}
}

async function handlePostUpdateNotification(req: Request, res: Response) {
	try {
		const incomingArticle = _assembleIncomingArticle(req);
		const savedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

		if (!savedEntry) {
			logger.info(`Post not found with postId: ${incomingArticle.id}`);
			return res.status(404).send({
				msg: 'Article not found',
				error: true,
				params: incomingArticle.id,
			} as AppResponseMessage);
		}

		const notificationEntry = _assembleNotificationEntry(incomingArticle);
		const document = await NotificationModel.updateNotificationById(notificationEntry);

		logger.verbose(`Notification updated with postId ${incomingArticle.id}`);
		return res.status(200).send('OK');
	} catch (error) {
		logger.error(`Could not update notification: ${error}`);
		return res.status(500).send({
			msg: 'The server encountered an unexpected error',
			error: true,
			params: error,
		}) as AppResponseMessage;
	}
}

export default {
	handlePostCreationNotification,
	handlePostUpdateNotification,
};
