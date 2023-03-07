import crypto from 'crypto';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import {
	GhostWebhook,
	GhostArticle,
	Notification,
	NotificationType,
	DomainForm,
	OwnedDomain,
} from '../../@types';
import { UserJwtPayload } from '../../@types/authorization';
import { User } from '../../@types/user';

type JwtDomainSignature = {
	domainName: string;
	domainOwner: string;
};

export default {
	convertIncomingWebhookToArticle: (req: Request) => {
		const incomingPost = req.body as GhostWebhook;
		if (Object.keys(incomingPost.post.current).length > 0) {
			return incomingPost.post.current as GhostArticle;
		}
		return incomingPost.post.previous as GhostArticle;
	},

	convertArticleToNotification: (
		ghostArticle: GhostArticle,
		notificationType: NotificationType
	): Notification => {
		return {
			id: crypto.randomUUID(),
			type: notificationType,
			ghostId: ghostArticle.id,
			ghostOriginalUrl: ghostArticle.url || '',
			ghostTitle: ghostArticle.title,
			ghostVisibility: ghostArticle.visibility,
			created: ghostArticle.updated_at,
		};
	},

	convertUrlToDomainName: (url: string): string => {
		const pathPaths = url.split('/');
		const protocol = pathPaths[0];
		const hostname = pathPaths[2];
		return `${protocol}//${hostname}`;
	},

	convertDomainFormToOwnedDomain(domain: DomainForm, domainOwner: string): OwnedDomain {
		return {
			id: crypto.randomUUID(),
			name: domain.name,
			status: domain.status,
			type: domain.type,
			owner: domainOwner,
			key: jwt.sign({ domainName: domain.name, domainOwner }, process.env.JWT_KEY || ''),
		};
	},

	convertUserToUserToken(user: User): string {
		return jwt.sign({ email: user.email, role: user.role }, process.env.JWT_KEY || '');
	},

	convertUserTokenToUserPayload(token: string) {
		return jwt.verify(token, process.env.JWT_KEY || '') as UserJwtPayload;
	},

	// TODO: add function to convert admin key to JWT
	// See https://ghost.org/docs/admin-api/#token-authentication
};
