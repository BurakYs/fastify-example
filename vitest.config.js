import path from 'path';

process.env.NODE_ENV = 'test';

export default {
	test: {
		globals: true
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
};