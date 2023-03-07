import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/http/NotFoundError';
import logger from '../util/logger.util';
import NotPermittedError from '../errors/http/NotPermitted';
import AppConfig from '../config/app.config';
import Responder from '../util/responder.util';
import { GN_ERROR_STATUS, GN_WARNING_STATUS } from '../../constants';

export default {
  validateUserCreationIsEnabled: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const appConfig = await AppConfig.readAppConfig();
      if (!appConfig.enableUserCreation) {
        throw new NotPermittedError(
          'User creation is disabled! Enable it in your admin settings before attemtping to create a new user',
        );
      }
      return next();
    } catch (error) {
      if (error instanceof NotPermittedError) {
        const {
          options: { code },
          message,
        } = error;
        return new Responder(req.headers['content-type'] || 'text/html', {
          onJson: () =>
            res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
          onOther: () =>
            res.redirect(
              `/signup?status=${GN_ERROR_STATUS}&message=${message}`,
            ),
        }).send();
      }

      logger.error(error);
      return new Responder(req.headers['content-type'] || 'text/html', {
        onJson: () =>
          res.status(500).send({ status: GN_ERROR_STATUS, error: error }),
        onOther: () =>
          res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${error}`),
      }).send();
    }
  },

  validateSuperUserWasCreated: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const appConfig = await AppConfig.readAppConfig();
      if (appConfig.wasSuperUserCreated) {
        throw new NotPermittedError('Superuser was already created');
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof NotPermittedError) {
        const {
          options: { code },
          message,
        } = error;
        return new Responder(req.headers['content-type'] || 'text/html', {
          onJson: () =>
            res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
          onOther: () =>
            res.redirect(
              `/signup?status=${GN_ERROR_STATUS}&message=${message}`,
            ),
        }).send();
      }

      logger.error(error);
      return new Responder(req.headers['content-type'] || 'text/html', {
        onJson: () =>
          res.status(500).send({ status: GN_ERROR_STATUS, error: error }),
        onOther: () =>
          res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${error}`),
      }).send();
    }
  },

  validateFirstApplicationVisit: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const appConfig = await AppConfig.readAppConfig();
      if (!appConfig.wasSuperUserCreated) {
        throw new NotFoundError(
          'This seems to be your first visit. You should start by creating a superuser',
        );
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        const {
          options: { code },
          message,
        } = error;
        return new Responder(req.headers['content-type'] || 'text/html', {
          onJson: () =>
            res
              .status(code)
              .send({ status: GN_WARNING_STATUS, error: message }),
          onOther: () =>
            res.redirect(
              `/signup/su?status=${GN_WARNING_STATUS}&message=${message}`,
            ),
        }).send();
      }

      logger.error(error);
      return new Responder(req.headers['content-type'] || 'text/html', {
        onJson: () =>
          res.status(500).send({ status: GN_WARNING_STATUS, error: error }),
        onOther: () =>
          res.redirect(
            `/signup/su?status=${GN_WARNING_STATUS}&message=${error}`,
          ),
      }).send();
    }
  },
};
