import { Request, Response } from 'express';
import readPackageJsonFile from '../../util/filesystem.util';
import DomainModel from '../domain/domain.model';
import NotificationModel from '../notification/notification.model';

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
		res.render('my-domains/home', { data: ownedDomains });
	},

	renderDomainNotificationsPage: async (req: Request, res: Response) => {
		const domainId = req.params.id;
		const domain = await DomainModel.getDomainById(domainId);
		const notifications = await NotificationModel.getNotificationsByDomainName(domain?.name || '');
		res.render('my-domains/notifications', { domain, notifications, count: notifications.length });
	},

	renderNotFoundPage: (req: Request, res: Response) => {
		res.render('404');
	},
};
