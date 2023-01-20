import { Request, Response } from 'express';

import Converter from '../../converters/index';
import NotificationModel from './notification.model';
import logger from '../../util/logger.util';

export default {
	handleArticleCreationNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);
			const duplicatedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

			if (!!duplicatedEntry) {
				throw new Error(`Attempt to update article ${incomingArticle.id} failed: Duplicated entry`);
			}

			const notification = Converter.convertArticleToNotification(incomingArticle);
			await NotificationModel.createNotification(notification);

			logger.verbose(`Notification created for article ${incomingArticle.id}`);
			return res.status(200).send('OK');
		} catch (error) {
			logger.error(error);
			res.status(500).send(error);
		}
	},

	handleArticleUpdateNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);
			const savedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

			if (!savedEntry) {
				const msg = `Attempt to update article ${incomingArticle.id} failed: Entry not found`;
				logger.error(msg);
				return res.status(404).send({ msg });
			}

			const notification = Converter.convertArticleToNotification(incomingArticle);
			await NotificationModel.updateNotificationById(notification);
			logger.verbose(`Notification updated for article ${incomingArticle.id}`);
		} catch (error) {
			logger.error(error);
			res.status(500).send(error);
		}
	},
};
