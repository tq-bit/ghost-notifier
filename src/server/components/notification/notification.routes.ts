import { Router } from 'express';
import NotificationController from './notification.controller';
import NotificationListener from './notification.listener';

const router: Router = Router();

router.get('/subscribe', NotificationListener.subscribeToArticleNotifications);

router.post('/article/create', NotificationController.handleArticleCreationNotification);
router.post('/article/update', NotificationController.handleArticleUpdateNotification);

export default router;
