import { Router, Request, Response, NextFunction } from 'express';
import NotificationController from './notification.controller';
import NotificationListener from './notification.listener';
import GhostWebhookValidator from '../../middleware/validators/GhostWebhook';

const router: Router = Router();

router.get('/subscribe', NotificationListener.subscribeToArticleNotifications);

router.post(
	'/article/create',
	GhostWebhookValidator.validate,
	NotificationController.handleArticleCreationNotification
);
router.post('/article/update', NotificationController.handleArticleUpdateNotification);

export default router;
