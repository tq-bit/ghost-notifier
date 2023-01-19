import typescript from '@rollup/plugin-typescript';

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
		plugins: [typescript()],
	},
	{
		input: 'src/client/index.ts',
		output: {
			file: './public/js/main.js',
			format: 'cjs',
		},
		plugins: [typescript()],
	},
];
