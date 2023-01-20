import { Request } from 'express';
import { GhostWebhook, GhostArticle, Notification } from '../../@types';

export default {
	convertIncomingWebhookToArticle: (req: Request) => {
		const incomingPost = req.body as GhostWebhook;
		return incomingPost.post.current as GhostArticle;
	},

	convertArticleToNotification: (ghostArticle: GhostArticle): Notification => {
		return {
			postId: ghostArticle.id,
			postOriginalUrl: ghostArticle.url,
			postPrimaryTag: ghostArticle.primary_tag?.slug || '',
			postTitle: ghostArticle.title,
			postVisibility: ghostArticle.visibility,
		};
	},
};
