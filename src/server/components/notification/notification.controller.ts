import { Request, Response } from 'express';

import Converter from '../../util/converter.util';
import NotificationModel from './notification.model';
import logger from '../../util/logger.util';
import { NotificationType, OwnedDomain } from '../../../@types';
import Responder from '../../util/responder.util';
import { GN_ERROR_STATUS, GN_SUCCESS_STATUS } from '../../../constants';

export default {
	handleArticleCreationNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);

			const notification = Converter.convertArticleToNotification(
				incomingArticle,
				NotificationType.PostPublished
			);
			await NotificationModel.createNotification(notification);
			logger.verbose(`Notification created for published article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			logger.error(error);
			res.status(500).send({ error });
		}
	},

	handleArticleUpdateNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);

			const notification = Converter.convertArticleToNotification(
				incomingArticle,
				NotificationType.PostUpdated
			);
			NotificationModel.createNotification(notification);
			logger.verbose(`Notification created for updated article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			logger.error(error);
			res.status(500).send({ error });
		}
	},

	handleArticleScheduleNotification: async (req: Request, res: Response) => {
		try {
			const incomingArticle = Converter.convertIncomingWebhookToArticle(req);

			const notification = Converter.convertArticleToNotification(
				incomingArticle,
				NotificationType.PostScheduled
			);
			NotificationModel.createNotification(notification);
			logger.verbose(`Notification created for scheduled article ${incomingArticle.id}`);

			return res.status(200).send('OK');
		} catch (error) {
			logger.error(error);
			res.status(500).send({ error });
		}
	},

	handleNotificationDeletionByDomain: async (req: Request, res: Response) => {
		try {
			const domain = req.body as OwnedDomain;

			const dbResponse = await NotificationModel.deleteNotificationsByDomainName(domain.name);
			const message = `${
				dbResponse.deletedCount > 0 ? dbResponse.deletedCount : 'No'
			} notifications where deleted for ${domain.name}`;

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
				onOther: () =>
					res.redirect(
						`/my-domains/${domain.id}/notifications?status=${GN_SUCCESS_STATUS}&message=${message}`
					),
			}).send();
		} catch (error) {
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error: error }),
				onOther: () => res.redirect(`/my-domains?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},
};
