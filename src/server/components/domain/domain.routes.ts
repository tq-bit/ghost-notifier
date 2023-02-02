import { Router } from 'express';
import DomainValidator from './domain.validator';
import DomainController from './domain.controller';
import NotificationListener from '../notification/notification.listener';
import notificationController from '../notification/notification.controller';
import Authenticator from '../../middleware/authenticator.middleware';

const router: Router = Router();

router.post(
	'/create',
	Authenticator.validateUserToken,
	DomainValidator.validateDomainEntry,
	DomainController.handleDomainCreation
);

router.post(
	'/:id/toggle-status',
	Authenticator.validateUserToken,
	DomainValidator.validateDomainOwner,
	DomainController.handleDomainStatusToggle
);

router.post(
	'/:id/delete',
	Authenticator.validateUserToken,
	DomainValidator.validateDomainOwner,
	DomainController.handleDomainDeletion
);

router.get(
	'/:id/notifications/subscribe',
	DomainValidator.validateDomainStatus,
	NotificationListener.subscribeToDomainNotifications
);

router.post(
	'/:id/notifications/delete',
	Authenticator.validateUserToken,
	DomainValidator.validateDomainOwner,
	DomainValidator.validateDomainStatus,
	notificationController.handleNotificationDeletionByDomain
);

// e.g. /api/domain/:id/notifications/subscribe

export default router;
