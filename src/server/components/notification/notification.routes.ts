import { Router } from 'express';
import NotificationController from './notification.controller';
import NotificationListener from './notification.listener';
import NotificationValidator from './notification.validator';
import DomainValidator from '../domain/domain.validator';

const router: Router = Router();

router.get('/subscribe', NotificationListener.subscribeToArticleNotifications);

router.post(
  '/article/create',
  NotificationValidator.validateGhostWebhook,
  DomainValidator.validateWebhookDomain,
  NotificationController.handleArticleCreationNotification,
);

router.post(
  '/article/update',
  NotificationValidator.validateGhostWebhook,
  DomainValidator.validateWebhookDomain,
  NotificationController.handleArticleUpdateNotification,
);

router.post(
  '/article/schedule',
  NotificationValidator.validateGhostWebhook,
  DomainValidator.validateWebhookDomain,
  NotificationController.handleArticleScheduleNotification,
);

export default router;
