import { Static, Type } from '@sinclair/typebox';

export type NotificationEventType =
	| 'open'
	| 'drop'
	| 'rename'
	| 'dropDatabase'
	| 'invalidate'
	| 'createIndexes'
	| 'create'
	| 'modify'
	| 'dropIndexes'
	| 'shardCollection'
	| 'reshardCollection'
	| 'refineCollectionShardKey'
	| 'insert'
	| 'update'
	| 'replace'
	| 'delete';

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
	created: Type.Date(),
});

export type Notification = Static<typeof Notification>;
