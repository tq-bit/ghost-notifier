import bcrypt from 'bcrypt';
import { User, UserForm } from '../../../@types/user';
import { userCollection } from '../../db/dbClient';

export default {
	createUser: (user: User) => {
		return userCollection.insertOne(user);
	},

	getUserById: (userId: string) => {
		return userCollection.findOne({ id: userId });
	},

	getUserByEmail: (userMail: string) => {
		const user: unknown = userCollection.findOne({ email: userMail });
		return user as User;
	},
};
