import { Request, Response } from 'express';

export default {
	handleUserCreation: (req: Request, res: Response) => {
		console.log(req.body);
	},
};
