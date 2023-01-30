import crypto from 'crypto';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {
	GhostWebhook,
	GhostArticle,
	Notification,
	NotificationType,
	DomainForm,
	OwnedDomain,
} from '../../@types';
import { UserForm, User, UserRole } from '../../@types/user';

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

	async convertIncomingUserCreationFormToNewUser(userForm: UserForm): Promise<User> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(userForm.password, salt);

		return {
			email: userForm.email,
			passwordHash: hash,
			role: UserRole.Admin,
		};
	},
};
