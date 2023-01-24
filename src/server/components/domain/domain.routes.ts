import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import DomainController from './domain.controller';
import NotificationListener from '../notification/notification.listener';

const router: Router = Router();

router.post('/create', Validator.validateDomainEntry, DomainController.handleDomainCreation);
router.post('/:id/toggle-status', DomainController.handleDomainStatusToggle);
router.post('/:id/delete', DomainController.handleDomainDeletion);

router.get(
	'/:id/notifications/subscribe',
	Validator.validateDomainStatus,
	NotificationListener.subscribeToDomainNotifications
);

// e.g. /api/domain/:id/notifications/subscribe

export default router;
