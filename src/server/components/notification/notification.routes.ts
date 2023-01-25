import { Router } from 'express';
import NotificationController from './notification.controller';
import NotificationListener from './notification.listener';
import Validator from '../../middleware/validator.middleware';

const router: Router = Router();

router.get('/subscribe', NotificationListener.subscribeToArticleNotifications);

router.post(
	'/article/create',
	Validator.validateGhostWebhook,
	Validator.validateWebhookDomain,
	NotificationController.handleArticleCreationNotification
);

router.post(
	'/article/update',
	Validator.validateGhostWebhook,
	Validator.validateWebhookDomain,
	NotificationController.handleArticleUpdateNotification
);

export default router;
