/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('@artonge/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AngularCompilerPlugin = webpack.AngularCompilerPlugin;
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var path = require('path');

var _root = path.resolve(__dirname, '.');

function getRoot(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [_root].concat(args));
}

module.exports = function(env, argv) {
	return {
		mode: env.production ? 'production' : 'development',

		entry: {
			polyfills: './src/polyfills.ts',
			background: './src/js/modules/background/main.ts',
			shelf: './src/js/modules/shelf/main.ts',
		},

		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /node_modules/,
						chunks: 'initial',
						name: 'vendor',
						priority: 10,
						enforce: true,
					},
				},
			},
		},

		target: 'web',

		devtool: env.production ? false : 'inline-source-map',

		watch: true,

		watchOptions: {
			ignored: ['node_modules'],
		},

		output: {
			path: getRoot('dist/Files'),
			publicPath: '/',
			filename: '[name].js',
		},

		resolve: {
			// Having ts before js is important for webpack watch to work
			// However, angular2-indexeddb creates an issue (ts files are packaged alongside js), so
			// you need to remove the .ts files from its node_modules folder
			// See https://github.com/gilf/angular2-indexeddb/issues/67
			extensions: ['.ts', '.js', '.html'],
		},

		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: ['@artonge/webpack', 'eslint-loader'],
				},
				{
					test: /.js$/,
					parser: {
						system: true,
					},
				},
				{
					test: /\.scss$/,
					include: getRoot('src', 'css'),
					use: ['raw-loader', 'sass-loader'],
				},

				{
					test: /\.scss$/,
					exclude: getRoot('src', 'css'),
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
			],
		},

		plugins: [
			// Define environment variables to export to Angular
			new DefinePlugin({
				'process.env.APP_VERSION': JSON.stringify(env.appversion),
			}),

			new AngularCompilerPlugin({
				tsConfigPath: './tsconfig.json',
				entryModules: [
					'./src/js/modules/background/background.module#AppModule',
					'./src/js/modules/shelf/shelf.module#ShelfModule',
				],
				sourceMap: true,
			}),

			new MiniCssExtractPlugin({
				filename: 'app.css',
			}),

			new CopyWebpackPlugin([
				{ from: path.join(process.cwd(), 'src/html/background.html') },
				{ from: path.join(process.cwd(), 'src/html/shelf.html') },
				{ from: path.join(process.cwd(), 'src/html/shelf_redirect.html'), to: 'html/shelf.html' },
				{ from: path.join(process.cwd(), 'src/assets'), to: 'assets' },
				{ from: path.join(process.cwd(), 'dependencies/coliseum.js') },
				{ from: path.join(process.cwd(), 'dependencies/cards.json') },
				{ from: path.join(process.cwd(), 'plugins'), to: 'plugins' },
				// All the OW stuff, like manifest.json
				{ from: path.join(process.cwd(), 'overwolf/*'), to: '..', flatten: true },
			]),

			// Replace the version in the manifest
			new ReplaceInFileWebpackPlugin([
				{
					dir: 'dist',
					files: ['manifest.json'],
					rules: [
						{
							search: '@app-version@',
							replace: env.appversion,
						},
					],
				},
			]),
			// Automatically update the version in sentry.properties
			new ReplaceInFileWebpackPlugin([
				{
					dir: '.',
					files: ['sentry.properties'],
					rules: [
						{
							search: '@app-version@',
							replace: env.appversion,
						},
					],
				},
			]),

			// new BundleAnalyzerPlugin(),
		],
	};
};
