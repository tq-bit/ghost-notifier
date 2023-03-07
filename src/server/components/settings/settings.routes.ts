import { Router } from 'express';
import Authenticator from '../../middleware/authenticator.middleware';
import SettingsController from './settings.controller';

const router: Router = Router();

router.post(
  '/toggle-user-creation',
  Authenticator.validateUserToken,
  Authenticator.validateAdminRole,
  SettingsController.toggleEnableUserCreation,
);

export default router;
