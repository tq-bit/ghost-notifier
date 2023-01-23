import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

/**
 * @type {import('rollup').RollupOptions[]}
 */

export default [
	{
		input: 'src/server/index.ts',
		output: {
			file: './dist/server.js',
			format: 'cjs',
		},
		external: ['crypto', 'cors', 'dotenv', 'express', 'express-handlebars', 'mongodb', 'winston'],
		plugins: [typescript()],
	},
	{
		input: 'src/client/index.ts',
		output: {
			file: './public/js/main.js',
			format: 'cjs',
			assetFileNames: '[name][extname]',
		},
		plugins: [typescript(), scss()],
	},
];
