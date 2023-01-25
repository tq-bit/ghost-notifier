import crypto from 'crypto';
import { Request } from 'express';
import { DateTime } from 'luxon';
import {
	GhostWebhook,
	GhostArticle,
	Notification,
	NotificationType,
	DomainForm,
	OwnedDomain,
} from '../../@types';

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

	convertDomainFormToOwnedDomain: (domain: DomainForm, domainOwner: string): OwnedDomain => {
		return {
			id: crypto.randomUUID(),
			name: domain.name,
			status: domain.status,
			type: domain.type,
			owner: domainOwner,
		};
	},
};
