import { Static, Type } from '@sinclair/typebox';

export enum NotificationType {
	Post = 'post',
	Page = 'page',
}

const Notification = Type.Object({
	id: Type.String(),
	type: Type.Enum(NotificationType),
	ghostId: Type.String(),
	ghostTitle: Type.String(),
	ghostVisibility: Type.String(),
	ghostOriginalUrl: Type.String(),
	ghostPrimaryTag: Type.String(),
});

export type Notification = Static<typeof Notification>;
