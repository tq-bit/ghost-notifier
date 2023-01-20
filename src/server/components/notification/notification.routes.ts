import { Router } from 'express';
import NotificationController from './notification.controller';
import NotificationListener from './notification.listener';
import GhostWebhookValidator from '../../middleware/validator';

const router: Router = Router();

router.get('/subscribe', NotificationListener.subscribeToArticleNotifications);

router.post(
	'/article/create',
	GhostWebhookValidator.validateGhostWebhook,
	NotificationController.handleArticleCreationNotification
);
router.post(
	'/article/update',
	GhostWebhookValidator.validateGhostWebhook,
	NotificationController.handleArticleUpdateNotification
);

export default router;
