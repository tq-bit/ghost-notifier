import { Request, Response } from 'express';
import readPackageJsonFile from '../../util/filesystem.util';

export default {
	renderHomePage: (req: Request, res: Response) => {
		return res.render('home');
	},

	renderAboutPage: async (req: Request, res: Response) => {
		const packageJson = await readPackageJsonFile();
		const aboutConfig = { packageJson };
		res.render('about', aboutConfig);
	},

	renderNotFoundPage: (req: Request, res: Response) => {
		res.render('404');
	},
};
