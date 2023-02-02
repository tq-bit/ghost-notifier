import { Router } from 'express';
import DomainValidator from './domain.validator';
import Authenticator from '../../middleware/authenticator.middleware';
import DomainController from './domain.controller';
import NotificationListener from '../notification/notification.listener';
import notificationController from '../notification/notification.controller';

const router: Router = Router();

router.post('/create', DomainValidator.validateDomainEntry, DomainController.handleDomainCreation);
router.post('/:id/toggle-status', DomainController.handleDomainStatusToggle);
router.post('/:id/delete', DomainController.handleDomainDeletion);

router.get(
	'/:id/notifications/subscribe',
	DomainValidator.validateDomainStatus,
	NotificationListener.subscribeToDomainNotifications
);

router.post(
	'/:id/notifications/delete',
	DomainValidator.validateDomainStatus,
	notificationController.handleNotificationDeletionByDomain
);

// e.g. /api/domain/:id/notifications/subscribe

export default router;
