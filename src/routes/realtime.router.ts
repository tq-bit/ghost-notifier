import { Router } from 'express';
import NotificationListener from '../realtime/notification.listener';

const router: Router = Router();

router.get('/notification', NotificationListener.handlePostNotification);

export default router;
