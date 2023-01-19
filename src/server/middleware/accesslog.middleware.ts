import {Request, Response, NextFunction} from 'express'
import logger from '../util/logger.util';

function accessLogger(req: Request, res: Response, next: NextFunction): void {
  const message = `${req.method} - ${req.protocol}://${req.hostname}${req.url} | IP: ${req.ip}`;
  logger.http(message);
  next();
}

export default accessLogger;
