import { Request, Response } from 'express';

import Converter from '../../converters/index';
import NotificationModel from './notification.model';
import logger from '../../util/logger.util';
import NotFoundError from '../../errors/http/NotFoundError';
import ConflictError from '../../errors/http/ConflictError';

export default {
	handleArticleCreationNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);
			const duplicatedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

			if (!!duplicatedEntry) {
				throw new ConflictError(
					`Attempt to create article ${incomingArticle.id} failed: Duplicated entry`
				);
			}

			const notification = Converter.convertArticleToNotification(incomingArticle);
			await NotificationModel.createNotification(notification);
			logger.verbose(`Notification created for article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			error instanceof ConflictError
				? res.status(error.options.code).send({ error: error.message })
				: res.status(500).send({ error });
		}
	},

	handleArticleUpdateNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);
			const savedEntry = await NotificationModel.getNotificationById(incomingArticle.id);

			if (!savedEntry) {
				throw new NotFoundError(
					`Attempt to update article ${incomingArticle.id} failed: Entry not found`
				);
			}

			const notification = Converter.convertArticleToNotification(incomingArticle);
			await NotificationModel.updateNotificationById(notification);
			logger.verbose(`Notification updated for article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			error instanceof NotFoundError
				? res.status(error.options.code).send({ error: error.message })
				: res.status(500).send({ error });
		}
	},
};
