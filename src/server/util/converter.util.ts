import { Request } from 'express';
import {
	GhostWebhook,
	GhostArticle,
	Notification,
	NotificationType,
	DomainForm,
	OwnedDomain,
} from '../../@types';
import crypto from 'crypto';

export default {
	convertIncomingWebhookToArticle: (req: Request) => {
		const incomingPost = req.body as GhostWebhook;
		console.log(incomingPost);
		if (Object.keys(incomingPost.post.current).length > 0) {
			console.log('current');
			return incomingPost.post.current as GhostArticle;
		}
		console.log('previous');
		return incomingPost.post.previous as GhostArticle;
	},

	convertArticleToNotification: (ghostArticle: GhostArticle): Notification => {
		return {
			id: crypto.randomUUID(),
			type: NotificationType.Post,
			ghostId: ghostArticle.id,
			ghostOriginalUrl: ghostArticle.url,
			ghostPrimaryTag: ghostArticle.primary_tag?.slug || '',
			ghostTitle: ghostArticle.title,
			ghostVisibility: ghostArticle.visibility,
		};
	},

	convertDomainFormToOwnedDomain: (domain: DomainForm, domainOwner: string): OwnedDomain => {
		return {
			name: domain.name,
			status: domain.status,
			type: domain.type,
			owner: domainOwner,
		};
	},
};
