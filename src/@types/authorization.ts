import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface DomainJwtPayload extends JwtPayload {
	domainName: string;
	domainOwner: string;
}

export interface UserJwtPayload extends JwtPayload {
	email: string;
}

export interface AuthorizedRequest extends Request {
	userJwtPayload: UserJwtPayload;
}
