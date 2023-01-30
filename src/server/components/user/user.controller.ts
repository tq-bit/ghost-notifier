import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import ConflictError from '../../errors/http/ConflictError';
import { UserForm, UserRole, User } from '../../../@types/user';
import UserModel from './user.model';
import Responder from '../../util/responder.util';
import Converter from '../../util/converter.util';
import { GN_COOKIE_NAME } from '../../constants';

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

			const status = 'success';
			const message = `User with mail ${user.email} created successfully. You can now start managing your domains`;

			const responder = new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(201).send({ status: status, message: message, token: userToken }),
				onOther: () => res.redirect(`/my-domains/home?status=${status}&message=${message}`),
			});

			res.cookie(GN_COOKIE_NAME, userToken);
			responder.send();
		} catch (error) {
			const status = error;
			let responder = null;
			if (error instanceof ConflictError) {
				const {
					options: { code },
					message,
				} = error;

				responder = new Responder(req.headers['content-type'] || 'text/html', {
					onJson: () => res.status(code).send({ status: status, error: message }),
					onOther: () => res.redirect(`/signup?status=${status}&message=${message}`),
				});
			}

			responder = new Responder(req.headers['content-type'] || 'text/html', {
				onJson: () => res.status(500).send({ status: status, error }),
				onOther: () => res.redirect(`/signup?status=${status}&message=${error}`),
			});
			return responder.send();
		}
	},
};
