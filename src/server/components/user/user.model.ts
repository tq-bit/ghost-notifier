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

	getUserByEmail: async (userMail: string) => {
		return userCollection.findOne({ email: userMail });
	},
};
