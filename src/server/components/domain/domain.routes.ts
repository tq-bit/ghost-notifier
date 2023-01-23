import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import DomainController from './domain.controller';

const router: Router = Router();

router.post('/create', Validator.validateDomainEntry, DomainController.handleDomainCreation);
router.post('/:id/toggle-status', DomainController.handleDomainStatusToggle);
router.post('/:id/delete', DomainController.handleDomainStatusToggle);

export default router;
