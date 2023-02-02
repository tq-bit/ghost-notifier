import { Router } from 'express';
import Authenticator from '../../middleware/authenticator.middleware';
import ViewController from './view.controller';

const router: Router = Router();

router.get('', ViewController.renderHomePage);
router.get('/about', ViewController.renderAboutPage);
router.get('/login', ViewController.renderLoginPage);
router.get('/signup', ViewController.renderSignupPage);
router.get('/my-domains/home', Authenticator.validateUserToken, ViewController.renderDomainsPage);
router.get(
	'/my-domains/:id/notifications',
	Authenticator.validateUserToken,
	ViewController.renderDomainNotificationsPage
);
router.get('/my-domains', (req, res) => res.redirect('/my-domains/home'));
router.get('/*', ViewController.renderNotFoundPage);

export default router;
