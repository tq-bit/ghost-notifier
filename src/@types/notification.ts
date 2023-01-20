import { Static, Type } from '@sinclair/typebox';

const Notification = Type.Object({
	postId: Type.String(),
	postTitle: Type.String(),
	postVisibility: Type.String(),
	postOriginalUrl: Type.String(),
	postPrimaryTag: Type.String(),
});

export type Notification = Static<typeof Notification>;
