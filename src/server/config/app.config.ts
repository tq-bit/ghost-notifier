import fs from 'fs/promises';
import path from 'path';
import { AppConfig } from '../../@types/app';

export default {
	getAppConfig: async () => {
		const buffer = await fs.readFile(path.join(__dirname, 'config.json'));
		return JSON.parse(Buffer.from(buffer).toString()) as AppConfig;
	},

	setAppConfig: async (appConfig: AppConfig) => {
		return fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(appConfig));
	},
};
