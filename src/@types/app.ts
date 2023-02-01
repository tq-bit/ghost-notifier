import { Static, Type } from '@sinclair/typebox';

const AppConfig = Type.Object({
	admin: Type.Object({
		users: Type.Object({
			enableUserCreation: Type.Boolean(),
			initialUserWasCreated: Type.Boolean(),
		}),
	}),
});

export type AppConfig = Static<typeof AppConfig>;
