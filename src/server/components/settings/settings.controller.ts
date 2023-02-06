import { Request, Response } from 'express';
import AppConfig from '../../config/app.config';

export default {
	toggleEnableUserCreation: async (req: Request, res: Response) => {
		const appConfig = await AppConfig.readAppConfig();

		await AppConfig.writeAppConfig({
			...appConfig,
			enableUserCreation: !appConfig.enableUserCreation,
		});
	},
};
