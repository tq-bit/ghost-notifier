import Ajv from 'ajv';
import { Static, Type } from '@sinclair/typebox';

export const GhostTag = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	feature_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	visibility: Type.String(),
	og_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	og_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	og_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	meta_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	meta_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	codeinjection_head: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	codeinjection_foot: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	canonical_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	accent_color: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	created_at: Type.String(),
	updated_at: Type.String(),
	url: Type.String(),
});

export const GhostRoles = Type.Object({
	id: Type.String(),
	name: Type.String(),
	description: Type.String(),
	created_at: Type.String(),
	updated_at: Type.String(),
});

export const GhostAuthor = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	email: Type.String(),
	profile_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	cover_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	bio: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	website: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	location: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	facebook: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	status: Type.String(),
	meta_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	meta_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	tour: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	last_seen: Type.String(),
	comment_notifications: Type.Boolean(),
	free_member_signup_notification: Type.Boolean(),
	paid_subscription_started_notification: Type.Boolean(),
	paid_subscription_canceled_notification: Type.Boolean(),
	created_at: Type.String(),
	updated_at: Type.String(),
	roles: Type.Array(GhostRoles),
});

export const GhostTier = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	active: Type.Boolean(),
	welcome_page_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	visibility: Type.String(),
	trial_days: Type.Number(),
	monthly_price_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	yearly_price_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	type: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	created_at: Type.String(),
	updated_at: Type.String(),
});

export const GhostArticle = Type.Object({
	id: Type.String(),
	uuid: Type.String(),
	title: Type.String(),
	slug: Type.String(),
	mobiledoc: Type.String(),
	html: Type.String(),
	feature_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	featured: Type.Boolean(),
	status: Type.String(),
	visibility: Type.String(),
	created_at: Type.String(),
	updated_at: Type.String(),
	custom_excerpt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	codeinjection_head: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	codeinjection_foot: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	custom_template: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	canonical_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	authors: Type.Array(GhostAuthor),
	tiers: Type.Array(GhostTier),
	tags: Type.Optional(Type.Array(GhostTag)),
	primary_author: GhostAuthor,
	primary_tag: Type.Optional(Type.Union([GhostTag, Type.Null()])),
	email_segment: Type.String(),
	url: Type.String(),
	excerpt: Type.String(),
	reading_time: Type.Number(),
	og_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	og_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	og_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	twitter_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	meta_title: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	meta_description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	email_subject: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	frontmatter: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	feature_image_alt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	feature_image_caption: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	email_only: Type.Boolean(),
});

export const GhostWebhook = Type.Object({
	post: Type.Object({
		current: GhostArticle,
		previous: Type.Optional(GhostArticle),
	}),
});

export type GhostTag = Static<typeof GhostTag>;
export type GhostRoles = Static<typeof GhostRoles>;
export type GhostAuthor = Static<typeof GhostAuthor>;
export type GhostTier = Static<typeof GhostTier>;
export type GhostArticle = Static<typeof GhostArticle>;
export type GhostWebhook = Static<typeof GhostWebhook>;

/**
 * Validation methods for Type Compiler
 */

const ajv = new Ajv();

export function validateGhostWebhook(data: GhostWebhook) {
	const validator = ajv.compile(GhostWebhook);
	const result = validator(data);
	return { result, errors: validator.errors };
}
