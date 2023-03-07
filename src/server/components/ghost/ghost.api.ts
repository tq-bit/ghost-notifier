import axios, { AxiosError, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';

interface WebhookOptions {
	appUrl: string;
	ghostBlogUrl: string;
	ghostAdminToken: string;
	domainKey: string;
}

interface GhostWebhookGenerationResponse {
	postPublishedResult: AxiosResponse;
	postPublishedEditedResult: AxiosResponse;
	postScheduledResult: AxiosResponse;
}

type AppWebhookGenerationResponse = [null | AxiosError, null | GhostWebhookGenerationResponse];

export default {
	generateAdminJwt(ghostBlogUrl: string, ghostAdminToken: string) {
		const [id, secret] = ghostAdminToken.split(':');
		return jwt.sign({}, Buffer.from(secret, 'hex'), {
			keyid: id,
			algorithm: 'HS256',
			expiresIn: '5m',
			audience: `/admin/`,
		});
	},

	async postGenerateWebooks({
		ghostBlogUrl,
		appUrl,
		ghostAdminToken,
		domainKey,
	}: WebhookOptions): Promise<AppWebhookGenerationResponse> {
		try {
			const url = `${ghostBlogUrl}/ghost/api/admin/webhooks/`;
			const token = this.generateAdminJwt(ghostBlogUrl, ghostAdminToken);

			const config = {
				headers: {
					authorization: `Ghost ${token}`,
				},
			};

			const payloadPostPublished = {
				webhooks: [
					{
						name: 'On post published',
						event: 'post.published',
						target_url: `${appUrl}/api/notification/article/create?key=${domainKey}`,
					},
				],
			};

			const payloadPostPublishedEdited = {
				webhooks: [
					{
						name: 'On published post updated',
						event: 'post.published.edited',
						target_url: `${appUrl}/api/notification/article/update?key=${domainKey}`,
					},
				],
			};

			const payloadPostScheduled = {
				webhooks: [
					{
						name: 'On post scheduled',
						event: 'post.scheduled',
						target_url: `${appUrl}/api/notification/article/scheduled?key=${domainKey}`,
					},
				],
			};

			const postPublishedResult = await axios.post(url, payloadPostPublished, config);
			const postPublishedEditedResult = await axios.post(url, payloadPostPublishedEdited, config);
			const postScheduledResult = await axios.post(url, payloadPostScheduled, config);

			return [
				null,
				{
					postPublishedResult,
					postPublishedEditedResult,
					postScheduledResult,
				},
			];
		} catch (error) {
			return [error as AxiosError, null];
		}
	},
};
