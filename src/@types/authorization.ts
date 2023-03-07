import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from './user';

export interface DomainJwtPayload extends JwtPayload {
  domainName: string;
  domainOwner: string;
}

export interface UserJwtPayload extends JwtPayload {
  email: string;
  role: UserRole;
}

export interface AuthorizedRequest extends Request {
  userJwtPayload: UserJwtPayload;
}
