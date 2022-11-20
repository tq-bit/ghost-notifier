import { Router, Request, Response } from 'express';
import readPackageJsonFile from '../util/filesystem.util';

const router: Router = Router();

async function renderHomePage(req: Request, res: Response): Promise<void> {
	res.render('home');
}

async function renderAboutPage(req: Request, res: Response): Promise<void> {
	const packageJson = await readPackageJsonFile();
	const aboutConfig = { packageJson };
	res.render('about', aboutConfig);
}

function renderNotFoundPage(req: Request, res: Response): void {
	res.render('404');
}

router.get('', renderHomePage);
router.get('/about', renderAboutPage);
router.get('/*', renderNotFoundPage);

export default router;
