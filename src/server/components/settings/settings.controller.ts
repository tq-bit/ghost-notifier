import { Request, Response } from 'express';
import AppConfig from '../../config/app.config';
import Responder from '../../util/responder.util';
import { GN_SUCCESS_STATUS } from '../../../constants';

export default {
  toggleEnableUserCreation: async (req: Request, res: Response) => {
    const appConfig = await AppConfig.readAppConfig();

    await AppConfig.writeAppConfig({
      ...appConfig,
      enableUserCreation: !appConfig.enableUserCreation,
    });

    const message = `${
      appConfig.enableUserCreation ? 'Disabled' : 'Enabled'
    } user creation`;
    return new Responder(req.headers['content-type'] || 'text/html', {
      onJson: () =>
        res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
      onOther: () =>
        res.redirect(
          `/settings?status=${GN_SUCCESS_STATUS}&message=${message}`,
        ),
    }).send();
  },
};
