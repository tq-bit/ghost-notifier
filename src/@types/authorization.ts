import { JwtPayload } from 'jsonwebtoken';

export interface DomainJwtPayload extends JwtPayload {
	domainName: string;
	domainOwner: string;
}
