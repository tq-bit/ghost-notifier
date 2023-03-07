import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import UserController from './user.controller';

const router: Router = Router();

router.post(
  '/create',
  Validator.validateFirstApplicationVisit,
  Validator.validateUserCreationIsEnabled,
  UserController.handleUserCreation,
);
router.post(
  '/create/su',
  Validator.validateSuperUserWasCreated,
  UserController.handleSuperUserCreation,
);
router.post('/login', UserController.handleUserLogin);
router.post('/logout', UserController.handleUserLogout);

export default router;
