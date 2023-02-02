import { Static, Type } from '@sinclair/typebox';

export enum UserRole {
	Admin = 'admin',
	SuperUser = 'superuser',
}

export const UserForm = Type.Object({
	email: Type.String(),
	password: Type.String(),
});

export const User = Type.Object({
	id: Type.String(),
	email: Type.String(),
	passwordHash: Type.String(),
	role: Type.Enum(UserRole),
});

export type User = Static<typeof User>;
export type UserForm = Static<typeof UserForm>;
