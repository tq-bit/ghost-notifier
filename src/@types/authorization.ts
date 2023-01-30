import { JwtPayload } from 'jsonwebtoken';

export interface DomainJwtPayload extends JwtPayload {
	domainName: string;
	domainOwner: string;
}

export interface UserJwtPayload extends JwtPayload {
	email: string;
}
