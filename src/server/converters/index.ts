import { Request } from 'express';
import { GhostPost, GhostArticle, NotificationEntry } from '../../@types';

export default {
	convertIncomingWebhookToArticle: (req: Request) => {
		const incomingPost = req.body as GhostPost;
		return incomingPost.post.current as GhostArticle;
	},

	convertArticleToNotification: (ghostArticle: GhostArticle): NotificationEntry => {
		return {
			postId: ghostArticle.id,
			postOriginalUrl: ghostArticle.url,
			postPrimaryTag: ghostArticle.primary_tag?.slug || '',
			postTitle: ghostArticle.title,
			postVisibility: ghostArticle.visibility,
		};
	},
};
