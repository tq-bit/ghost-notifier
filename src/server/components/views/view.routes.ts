import { Router } from 'express';
import ViewController from './view.controller';

const router: Router = Router();

router.get('', ViewController.renderHomePage);
router.get('/about', ViewController.renderAboutPage);
router.get('/*', ViewController.renderNotFoundPage);

export default router;
