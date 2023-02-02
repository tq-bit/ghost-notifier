import { Router } from 'express';
import DomainValidator from './domain.validator';
import DomainController from './domain.controller';
import NotificationListener from '../notification/notification.listener';
import notificationController from '../notification/notification.controller';
import Authenticator from '../../middleware/authenticator.middleware';

const router: Router = Router();

router.post(
	'/create',
	DomainValidator.validateDomainEntry,
	Authenticator.validateUserToken,
	DomainController.handleDomainCreation
);
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
