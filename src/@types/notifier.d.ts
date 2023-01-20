// TODO: Make this interface more generic to also work for authors and pages

export interface NotificationEntry {
	postId: string;
	postTitle: string;
	postVisibility: string;
	postOriginalUrl: string;
	postPrimaryTag: string;
}

export interface AppResponseMessage {
	msg?: string;
	error?: boolean;
	params?: any;
}
