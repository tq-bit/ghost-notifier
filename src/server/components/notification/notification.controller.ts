import { Request, Response } from 'express';

import Converter from '../../util/converter.util';
import NotificationModel from './notification.model';
import logger from '../../util/logger.util';
import NotFoundError from '../../errors/http/NotFoundError';

export default {
	handleArticleCreationNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);

			const notification = Converter.convertArticleToNotification(incomingArticle);
			await NotificationModel.createNotification(notification);
			logger.verbose(`Notification created for article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			logger.error(error);
			res.status(500).send({ error });
		}
	},

	handleArticleUpdateNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);
			// FIXME: Rewrite update method to look for Ghost ID
			const currentNotification = await NotificationModel.getNotificationById(incomingArticle.id);

			if (!currentNotification) {
				throw new NotFoundError(
					`Attempt to update article ${incomingArticle.id} failed: Entry not found`
				);
			}

			const notification = Converter.convertArticleToNotification(incomingArticle);
			NotificationModel.updateNotificationById(notification);
			logger.verbose(`Notification updated for article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			error instanceof NotFoundError
				? res.status(error.options.code).send({ error: error.message })
				: () => {
						logger.error(error);
						res.status(500).send({ error });
				  };
		}
	},
};
