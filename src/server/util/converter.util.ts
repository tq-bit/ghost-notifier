import { Request } from 'express';
import { GhostWebhook, GhostArticle, Notification, NotificationType } from '../../@types';
import crypto from 'crypto';

export default {
	convertIncomingWebhookToArticle: (req: Request) => {
		const incomingPost = req.body as GhostWebhook;
		return incomingPost.post.current as GhostArticle;
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
};
