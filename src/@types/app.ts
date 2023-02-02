import { Static, Type } from '@sinclair/typebox';

const AppConfig = Type.Object({
	enableUserCreation: Type.Boolean(),
	wasSuperUserCreated: Type.Boolean(),
});

export type AppConfig = Static<typeof AppConfig>;
