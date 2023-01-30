import { Static, Type } from '@sinclair/typebox';

export enum UserRole {
	Admin = 'admin',
}

export const UserCreationForm = Type.Object({
	email: Type.String(),
	password: Type.String(),
});

export const User = Type.Object({
	name: Type.String(),
	email: Type.String(),
	passwordHash: Type.String(),
	role: Type.Enum(UserRole),
});

export type User = Static<typeof User>;
export type UserCreationForm = Static<typeof UserCreationForm>;
