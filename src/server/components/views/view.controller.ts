import { Request, Response } from 'express';
import readPackageJsonFile from '../../util/filesystem.util';
import DomainModel from '../domain/domain.model';

export default {
	renderHomePage: (req: Request, res: Response) => {
		return res.render('home');
	},

	renderAboutPage: async (req: Request, res: Response) => {
		const packageJson = await readPackageJsonFile();
		const aboutConfig = { packageJson };
		res.render('about', aboutConfig);
	},

	renderDomainsPage: async (req: Request, res: Response) => {
		const ownedDomains = await DomainModel.getDomainsByOwner('t.quante@outlook.com');
		console.log(ownedDomains);
		res.render('domains', { data: ownedDomains });
	},

	renderNotFoundPage: (req: Request, res: Response) => {
		res.render('404');
	},
};
