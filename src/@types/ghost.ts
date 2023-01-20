import { Static, Type } from '@sinclair/typebox';

const GhostTag = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	description: Type.Optional(Type.String()),
	feature_image: Type.Optional(Type.String()),
	visibility: Type.String(),
	og_image: Type.Optional(Type.String()),
	og_title: Type.Optional(Type.String()),
	og_description: Type.Optional(Type.String()),
	twitter_image: Type.Optional(Type.String()),
	twitter_title: Type.Optional(Type.String()),
	twitter_description: Type.Optional(Type.String()),
	meta_title: Type.Optional(Type.String()),
	meta_description: Type.Optional(Type.String()),
	codeinjection_head: Type.Optional(Type.String()),
	codeinjection_foot: Type.Optional(Type.String()),
	canonical_url: Type.Optional(Type.String()),
	accent_color: Type.Optional(Type.String()),
	created_at: Type.String(),
	updated_at: Type.String(),
	url: Type.String(),
});

const GhostRoles = Type.Object({
	id: Type.String(),
	name: Type.String(),
	description: Type.String(),
	created_at: Type.String(),
	updated_at: Type.String(),
});

const GhostAuthor = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	email: Type.String(),
	profile_image: Type.Optional(Type.String()),
	cover_image: Type.Optional(Type.String()),
	bio: Type.Optional(Type.String()),
	website: Type.Optional(Type.String()),
	location: Type.Optional(Type.String()),
	facebook: Type.Optional(Type.String()),
	twitter: Type.Optional(Type.String()),
	status: Type.String(),
	meta_title: Type.Optional(Type.String()),
	meta_description: Type.Optional(Type.String()),
	tour: Type.Optional(Type.String()),
	last_seen: Type.String(),
	comment_notifications: Type.Boolean(),
	free_member_signup_notification: Type.Boolean(),
	paid_subscription_started_notification: Type.Boolean(),
	paid_subscription_canceled_notification: Type.Boolean(),
	created_at: Type.String(),
	updated_at: Type.String(),
	roles: Type.Array(GhostRoles),
});

const GhostTier = Type.Object({
	id: Type.String(),
	name: Type.String(),
	slug: Type.String(),
	active: Type.Boolean(),
	welcome_page_url: Type.Optional(Type.String()),
	visibility: Type.String(),
	trial_days: Type.Number(),
	monthly_price_id: Type.Optional(Type.String()),
	yearly_price_id: Type.Optional(Type.String()),
	description: Type.String(),
	type: Type.String(),
	created_at: Type.String(),
	updated_at: Type.String(),
});

const GhostArticle = Type.Object({
	id: Type.String(),
	uuid: Type.String(),
	title: Type.String(),
	slug: Type.String(),
	mobiledoc: Type.String(),
	html: Type.String(),
	feature_image: Type.Optional(Type.String()),
	featured: Type.Boolean(),
	status: Type.String(),
	visibility: Type.String(),
	created_at: Type.String(),
	updated_at: Type.String(),
	custom_excerpt: Type.Optional(Type.String()),
	codeinjection_head: Type.Optional(Type.String()),
	codeinjection_foot: Type.Optional(Type.String()),
	custom_template: Type.Optional(Type.String()),
	canonical_url: Type.Optional(Type.String()),
	authors: Type.Array(GhostAuthor),
	tiers: Type.Array(GhostTier),
	tags: Type.Optional(Type.Array(GhostTag)),
	primary_author: Type.Object(GhostAuthor),
	primary_tag: Type.Optional(Type.Object(GhostTag)),
	email_segment: Type.String(),
	url: Type.String(),
	excerpt: Type.String(),
	reading_time: Type.Number(),
	og_image: Type.Optional(Type.String()),
	og_title: Type.Optional(Type.String()),
	og_description: Type.Optional(Type.String()),
	twitter_image: Type.Optional(Type.String()),
	twitter_title: Type.Optional(Type.String()),
	twitter_description: Type.Optional(Type.String()),
	meta_title: Type.Optional(Type.String()),
	meta_description: Type.Optional(Type.String()),
	email_subject: Type.Optional(Type.String()),
	frontmatter: Type.Optional(Type.String()),
	feature_image_alt: Type.Optional(Type.String()),
	feature_image_caption: Type.Optional(Type.String()),
	email_only: Type.Boolean(),
});

const GhostWebhook = Type.Object({
	post: Type.Object({
		current: GhostArticle,
	}),
});

export type GhostTag = Static<typeof GhostTag>;
export type GhostRoles = Static<typeof GhostRoles>;
export type GhostAuthor = Static<typeof GhostAuthor>;
export type GhostTier = Static<typeof GhostTier>;
export type GhostArticle = Static<typeof GhostArticle>;
export type GhostWebhook = Static<typeof GhostWebhook>;
