import { Request, Response } from 'express';
import { AuthorizedRequest } from '../../../@types/authorization';
import AppConfig from '../../config/app.config';
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
    const domainOwner = (req as AuthorizedRequest).userJwtPayload?.email;
    const ownedDomains = await DomainModel.getDomainsByOwner(domainOwner);
    res.render('my-domains/home', { data: ownedDomains, user: domainOwner });
  },

  renderDomainNotificationsPage: async (req: Request, res: Response) => {
    const domainOwner = (req as AuthorizedRequest).userJwtPayload?.email;
    const domainId = req.params.id;
    const domain = await DomainModel.getDomainByIdAndOwner(
      domainId,
      domainOwner,
    );
    const notifications = await NotificationModel.getNotificationsByDomainName(
      domain?.name || '',
    );
    res.render('my-domains/notifications', {
      domain,
      notifications,
      count: notifications.length,
    });
  },

  renderSettingsPage: async (req: Request, res: Response) => {
    const { userJwtPayload } = req as AuthorizedRequest;
    const settingsScope = await AppConfig.readAppConfig();
    const adminScope = {
      isSuperUser: userJwtPayload.role === 'superuser',
      isAdmin:
        userJwtPayload.role === 'superuser' || userJwtPayload.role === 'admin',
    };

    res.render('user/settings', { userJwtPayload, adminScope, settingsScope });
  },

  renderLoginPage: (req: Request, res: Response) => {
    res.render('user/login');
  },

  renderSignupPage: (req: Request, res: Response) => {
    res.render('user/signup');
  },
  renderSuSignupPage: (req: Request, res: Response) => {
    res.render('user/su-signup');
  },

  renderNotFoundPage: (req: Request, res: Response) => {
    res.render('404');
  },
};
