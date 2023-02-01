import { Router } from 'express';
import Validator from '../../middleware/validator.middleware';
import UserController from './user.controller';

const router: Router = Router();

router.post('/create', UserController.handleUserCreation);
router.post('/login', UserController.handleUserLogin);

export default router;
