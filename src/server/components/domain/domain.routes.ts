import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import DomainController from './domain.controller';
import NotificationListener from '../notification/notification.listener';
import notificationController from '../notification/notification.controller';

const router: Router = Router();

router.post('/create', Validator.validateDomainEntry, DomainController.handleDomainCreation);
router.post('/:id/toggle-status', DomainController.handleDomainStatusToggle);
router.post('/:id/delete', DomainController.handleDomainDeletion);

router.get(
	'/:id/notifications/subscribe',
	Validator.validateDomainStatus,
	NotificationListener.subscribeToDomainNotifications
);

router.post(
	'/:id/notifications/delete',
	Validator.validateDomainStatus,
	notificationController.handleNotificationDeletionByDomain
);

// e.g. /api/domain/:id/notifications/subscribe

export default router;
