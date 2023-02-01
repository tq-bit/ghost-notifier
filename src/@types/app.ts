import { Static, Type } from '@sinclair/typebox';

const AppConfig = Type.Object({
	admin: Type.Object({
		enableUserCreation: Type.Boolean(),
	}),
});

export type AppConfig = Static<typeof AppConfig>;
