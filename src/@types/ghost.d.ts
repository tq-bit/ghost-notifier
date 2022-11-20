interface GhostTag {
	id: string;
	name: string;
	slug: string;
	description?: string;
	feature_image?: string;
	visibility: string;
	og_image?: string;
	og_title?: string;
	og_description?: string;
	twitter_image?: string;
	twitter_title?: string;
	twitter_description?: string;
	meta_title?: string;
	meta_description?: string;
	codeinjection_head?: string;
	codeinjection_foot?: string;
	canonical_url?: string;
	accent_color?: string;
	created_at: string;
	updated_at: string;
	url: string;
}

interface GhostRoles {
	id: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
}

interface GhostAuthor {
	id: string;
	name: string;
	slug: string;
	email: string;
	profile_image?: string;
	cover_image?: string;
	bio?: string;
	website?: string;
	location?: string;
	facebook?: string;
	twitter?: string;
	status: string;
	meta_title?: string;
	meta_description?: string;
	tour?: string;
	last_seen: string;
	comment_notifications: boolean;
	free_member_signup_notification: boolean;
	paid_subscription_started_notification: boolean;
	paid_subscription_canceled_notification: boolean;
	created_at: string;
	updated_at: string;
	roles: GhostRoles[];
}

interface GhostTier {
	id: string;
	name: string;
	slug: string;
	active: boolean;
	welcome_page_url?: string;
	visibility: string;
	trial_days: number;
	monthly_price_id?: string;
	yearly_price_id?: string;
	description: string;
	type: string;
	created_at: string;
	updated_at: string;
}

export interface GhostArticle {
	id: string;
	uuid: string;
	title: string;
	slug: string;
	mobiledoc: string;
	html: string;
	feature_image?: string;
	featured: boolean;
	status: string;
	visibility: string;
	created_at: string;
	updated_at: string;
	custom_excerpt?: string;
	codeinjection_head?: string;
	codeinjection_foot?: string;
	custom_template?: string;
	canonical_url?: string;
	authors: GhostAuthor[];
	tiers: GhostTier[];
	tags?: GhostTag[];
	primary_author: GhostAuthor;
	primary_tag?: GhostTag;
	email_segment: string;
	url: string;
	excerpt: string;
	reading_time: number;
	og_image?: string;
	og_title?: string;
	og_description?: string;
	twitter_image?: string;
	twitter_title?: string;
	twitter_description?: string;
	meta_title?: string;
	meta_description?: string;
	email_subject?: string;
	frontmatter?: string;
	feature_image_alt?: string;
	feature_image_caption?: string;
	email_only: boolean;
}

export interface GhostPost {
	post: {
		current: GhostArticle;
	};
}
