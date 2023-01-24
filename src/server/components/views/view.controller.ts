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
		res.render('domains', { data: ownedDomains });
	},

	renderDomainNotificationsPage: async (req: Request, res: Response) => {
		const domainId = req.params.id;
		const domain = await DomainModel.getDomainById(domainId);
		res.render('domain-notifications', { domain });
	},

	renderNotFoundPage: (req: Request, res: Response) => {
		res.render('404');
	},
};
