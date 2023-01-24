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
		external: [
			'crypto',
			'cors',
			'dotenv',
			'express',
			'express-handlebars',
			'mongodb',
			'ajv',
			'@sinclair/typebox',
			'winston',
		],
		plugins: [typescript()],
	},

	// Common Javascript for all pages
	{
		input: 'src/client/index.ts',
		output: {
			file: './public/js/main.js',
			format: 'cjs',
		},
		plugins: [typescript(), scss()],
	},

	// View components
	{
		input: 'src/client/views/domain.ts',
		output: {
			file: './public/js/domain.js',
			format: 'cjs',
		},
		plugins: [typescript()],
	},

	{
		input: 'src/client/views/domain-notifications.ts',
		output: {
			file: './public/js/domain-notifications.js',
			format: 'cjs',
		},
		plugins: [typescript()],
	},

	// Styles
	{
		input: 'src/client/styles/styles.main.ts',
		output: {
			file: './public/css/main.js',
			format: 'cjs',
			assetFileNames: '[name][extname]',
		},
		plugins: [typescript(), scss()],
	},
];
