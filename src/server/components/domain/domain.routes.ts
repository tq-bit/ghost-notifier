import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import DomainController from './domain.controller';

const router: Router = Router();

router.post('/create', Validator.validateDomainEntry, DomainController.handleDomainCreation);

export default router;
