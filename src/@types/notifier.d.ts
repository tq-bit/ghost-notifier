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
