import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import ConflictError from '../../errors/http/ConflictError';
import { UserForm, UserRole, User } from '../../../@types/user';
import UserModel from './user.model';
import Responder from '../../util/responder.util';
import Converter from '../../util/converter.util';
import { GN_COOKIE_NAME, GN_ERROR_STATUS, GN_SUCCESS_STATUS } from '../../../constants';
import NotFoundError from '../../errors/http/NotFoundError';

export default {
	handleUserCreation: async (req: Request, res: Response) => {
		try {
			const userForm = req.body as UserForm;

			const existingUser = await UserModel.getUserByEmail(userForm.email);

			if (existingUser) {
				throw new ConflictError(`User with email ${userForm.email} already exists!`);
			}
			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(userForm.password, salt);
			const user: User = {
				id: crypto.randomUUID(),
				email: userForm.email,
				passwordHash: hash,
				role: UserRole.Admin,
			};

			await UserModel.createUser(user);

			const userToken = Converter.convertUserToUserToken(user);
			const message = `User with mail ${user.email} created successfully. You can now start managing your domains`;

			res.cookie(GN_COOKIE_NAME, userToken);
			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () =>
					res.status(201).send({ status: GN_SUCCESS_STATUS, message: message, token: userToken }),
				onOther: () =>
					res.redirect(`/my-domains/home?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof ConflictError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`/signup?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	handleUserLogin: async (req: Request, res: Response) => {
		try {
			const userForm = req.body as UserForm;

			const existingUser = await UserModel.getUserByEmail(userForm.email);
			if (!existingUser) {
				throw new NotFoundError(`User with Email ${userForm.email} not found`);
			}

			const passwordsMatch = await bcrypt.compare(userForm.password, existingUser.passwordHash);
			if (!passwordsMatch) {
				throw new NotFoundError(`No user found with this email/password combination`);
			}

			const userToken = Converter.convertUserToUserToken(existingUser);
			const message = `Login successful!`;
			res.cookie(GN_COOKIE_NAME, userToken);

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () =>
					res.status(200).send({ status: GN_SUCCESS_STATUS, message: message, token: userToken }),
				onOther: () =>
					res.redirect(`/my-domains/home?status=${GN_SUCCESS_STATUS}&message=${message}`),
			}).send();
		} catch (error) {
			if (error instanceof NotFoundError) {
				const {
					options: { code },
					message,
				} = error;

				return new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: GN_ERROR_STATUS, error: message }),
					onOther: () => res.redirect(`/login?status=${GN_ERROR_STATUS}&message=${message}`),
				}).send();
			}

			return new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: GN_ERROR_STATUS, error }),
				onOther: () => res.redirect(`/login?status=${GN_ERROR_STATUS}&message=${error}`),
			}).send();
		}
	},

	handleUserLogout: (req: Request, res: Response) => {
		res.clearCookie(GN_COOKIE_NAME);
		const message = 'You have successfully logged out';
		return new Responder(req.headers['content-type'] || 'text/html', {
			onJson: () => res.status(200).send({ status: GN_SUCCESS_STATUS, message: message }),
			onOther: () => res.redirect(`/?status=${GN_SUCCESS_STATUS}&message=${message}`),
		}).send();
	},
};
