import { Router } from 'express';
import ArticleController from '../controller/article.controller';

const router: Router = Router();

router.post('/publish', ArticleController.handlePostCreationNotification);
router.post('/update', ArticleController.handlePostUpdateNotification);

export default router;
