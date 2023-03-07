import fs from 'fs/promises';
import path from 'path';
import { AppConfig } from '../../@types/app';

export default {
  readAppConfig: async () => {
    const buffer = await fs.readFile(path.join(__dirname, 'config.json'));
    const appConfig: AppConfig = JSON.parse(Buffer.from(buffer).toString());
    return appConfig;
  },

  writeAppConfig: async (appConfig: AppConfig) => {
    return await fs.writeFile(
      path.join(__dirname, 'config.json'),
      JSON.stringify(appConfig),
    );
  },
};
